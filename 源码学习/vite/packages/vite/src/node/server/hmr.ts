import fsp from 'node:fs/promises'
import path from 'node:path'
import type { Server } from 'node:http'
import { EventEmitter } from 'node:events'
import colors from 'picocolors'
import type { CustomPayload, HMRPayload, Update } from 'types/hmrPayload'
import type { RollupError } from 'rollup'
import { CLIENT_DIR } from '../constants'
import { createDebugger, normalizePath } from '../utils'
import type { InferCustomEventPayload, ViteDevServer } from '..'
import { isCSSRequest } from '../plugins/css'
import { getAffectedGlobModules } from '../plugins/importMetaGlob'
import { isExplicitImportRequired } from '../plugins/importAnalysis'
import { getEnvFilesForMode } from '../env'
import { withTrailingSlash, wrapId } from '../../shared/utils'
import type { ModuleNode } from './moduleGraph'
import { restartServerWithUrls } from '.'

export const debugHmr = createDebugger('vite:hmr')

const whitespaceRE = /\s/

const normalizedClientDir = normalizePath(CLIENT_DIR)

export interface HmrOptions {
  protocol?: string
  host?: string
  port?: number
  clientPort?: number
  path?: string
  timeout?: number
  overlay?: boolean
  server?: Server
  /** @internal */
  channels?: HMRChannel[]
}

export interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}

interface PropagationBoundary {
  boundary: ModuleNode
  acceptedVia: ModuleNode
  isWithinCircularImport: boolean
}

export interface HMRBroadcasterClient {
  /**
   * Send event to the client
   */
  send(payload: HMRPayload): void
  /**
   * Send custom event
   */
  send(event: string, payload?: CustomPayload['data']): void
}

export interface HMRChannel {
  /**
   * Unique channel name 唯一的频道名称
   */
  name: string
  /**
   * Broadcast events to all clients 向所有客户端广播事件
   */
  send(payload: HMRPayload): void
  /**
   * Send custom event 发送自定义事件
   */
  send<T extends string>(event: T, payload?: InferCustomEventPayload<T>): void
  /**
   * Handle custom event emitted by `import.meta.hot.send` 处理“import.meta.hot.send”发出的自定义事件
   */
  on<T extends string>(
    event: T,
    listener: (
      data: InferCustomEventPayload<T>,
      client: HMRBroadcasterClient,
      ...args: any[]
    ) => void,
  ): void
  on(event: 'connection', listener: () => void): void
  /**
   * Unregister event listener 取消注册事件监听器
   */
  off(event: string, listener: Function): void
  /**
   * Start listening for messages 开始监听消息
   */
  listen(): void
  /**
   * Disconnect all clients, called when server is closed or restarted. 断开所有客户端的连接，在服务器关闭或重新启动时调用
   */
  close(): void
}

export interface HMRBroadcaster extends Omit<HMRChannel, 'close' | 'name'> {
  /**
   * All registered channels. Always has websocket channel.
   */
  readonly channels: HMRChannel[]
  /**
   * Add a new third-party channel.
   */
  addChannel(connection: HMRChannel): HMRBroadcaster
  close(): Promise<unknown[]>
}

export function getShortName(file: string, root: string): string {
  return file.startsWith(withTrailingSlash(root))
    ? path.posix.relative(root, file)
    : file
}

export async function handleHMRUpdate(
  type: 'create' | 'delete' | 'update',
  file: string,
  server: ViteDevServer,
): Promise<void> {
  const { hot, config, moduleGraph } = server
  const shortFile = getShortName(file, config.root)

  const isConfig = file === config.configFile
  const isConfigDependency = config.configFileDependencies.some(
    (name) => file === name,
  )

  const isEnv =
    config.inlineConfig.envFile !== false &&
    getEnvFilesForMode(config.mode, config.envDir).includes(file)
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server
    debugHmr?.(`[config change] ${colors.dim(shortFile)}`)
    config.logger.info(
      colors.green(
        `${path.relative(process.cwd(), file)} changed, restarting server...`,
      ),
      { clear: true, timestamp: true },
    )
    try {
      await restartServerWithUrls(server)
    } catch (e) {
      config.logger.error(colors.red(e))
    }
    return
  }

  debugHmr?.(`[file change] ${colors.dim(shortFile)}`)

  // (dev only) the client itself cannot be hot updated.
  if (file.startsWith(withTrailingSlash(normalizedClientDir))) {
    hot.send({
      type: 'full-reload',
      path: '*',
      triggeredBy: path.resolve(config.root, file),
    })
    return
  }

  const mods = new Set(moduleGraph.getModulesByFile(file))
  if (type === 'create') {
    for (const mod of moduleGraph._hasResolveFailedErrorModules) {
      mods.add(mod)
    }
  }
  if (type === 'create' || type === 'delete') {
    for (const mod of getAffectedGlobModules(file, server)) {
      mods.add(mod)
    }
  }

  // check if any plugin wants to perform custom HMR handling
  const timestamp = Date.now()
  const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: [...mods],
    read: () => readModifiedFile(file),
    server,
  }

  if (type === 'update') {
    for (const hook of config.getSortedPluginHooks('handleHotUpdate')) {
      const filteredModules = await hook(hmrContext)
      if (filteredModules) {
        hmrContext.modules = filteredModules
      }
    }
  }

  if (!hmrContext.modules.length) {
    // html file cannot be hot updated
    if (file.endsWith('.html')) {
      config.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
        clear: true,
        timestamp: true,
      })
      hot.send({
        type: 'full-reload',
        path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file)),
      })
    } else {
      // loaded but not in the module graph, probably not js
      debugHmr?.(`[no modules matched] ${colors.dim(shortFile)}`)
    }
    return
  }

  updateModules(shortFile, hmrContext.modules, timestamp, server)
}

type HasDeadEnd = boolean

export function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, hot, moduleGraph }: ViteDevServer,
  afterInvalidation?: boolean,
): void {
  const updates: Update[] = []
  const invalidatedModules = new Set<ModuleNode>()
  const traversedModules = new Set<ModuleNode>()
  // Modules could be empty if a root module is invalidated via import.meta.hot.invalidate()
  let needFullReload: HasDeadEnd = modules.length === 0

  for (const mod of modules) {
    const boundaries: PropagationBoundary[] = []
    const hasDeadEnd = propagateUpdate(mod, traversedModules, boundaries)

    moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true)

    if (needFullReload) {
      continue
    }

    if (hasDeadEnd) {
      needFullReload = hasDeadEnd
      continue
    }

    updates.push(
      ...boundaries.map(
        ({ boundary, acceptedVia, isWithinCircularImport }) => ({
          type: `${boundary.type}-update` as const,
          timestamp,
          path: normalizeHmrUrl(boundary.url),
          acceptedPath: normalizeHmrUrl(acceptedVia.url),
          explicitImportRequired:
            boundary.type === 'js'
              ? isExplicitImportRequired(acceptedVia.url)
              : false,
          isWithinCircularImport,
          // browser modules are invalidated by changing ?t= query,
          // but in ssr we control the module system, so we can directly remove them form cache
          ssrInvalidates: getSSRInvalidatedImporters(acceptedVia),
        }),
      ),
    )
  }

  if (needFullReload) {
    const reason =
      typeof needFullReload === 'string'
        ? colors.dim(` (${needFullReload})`)
        : ''
    config.logger.info(
      colors.green(`page reload `) + colors.dim(file) + reason,
      { clear: !afterInvalidation, timestamp: true },
    )
    hot.send({
      type: 'full-reload',
      triggeredBy: path.resolve(config.root, file),
    })
    return
  }

  if (updates.length === 0) {
    debugHmr?.(colors.yellow(`no update happened `) + colors.dim(file))
    return
  }

  config.logger.info(
    colors.green(`hmr update `) +
      colors.dim([...new Set(updates.map((u) => u.path))].join(', ')),
    { clear: !afterInvalidation, timestamp: true },
  )
  hot.send({
    type: 'update',
    updates,
  })
}

function populateSSRImporters(
  module: ModuleNode,
  timestamp: number,
  seen: Set<ModuleNode> = new Set(),
) {
  module.ssrImportedModules.forEach((importer) => {
    if (seen.has(importer)) {
      return
    }
    if (
      importer.lastHMRTimestamp === timestamp ||
      importer.lastInvalidationTimestamp === timestamp
    ) {
      seen.add(importer)
      populateSSRImporters(importer, timestamp, seen)
    }
  })
  return seen
}

function getSSRInvalidatedImporters(module: ModuleNode) {
  return [...populateSSRImporters(module, module.lastHMRTimestamp)].map(
    (m) => m.file!,
  )
}

function areAllImportsAccepted(
  importedBindings: Set<string>,
  acceptedExports: Set<string>,
) {
  for (const binding of importedBindings) {
    if (!acceptedExports.has(binding)) {
      return false
    }
  }
  return true
}

function propagateUpdate(
  node: ModuleNode,
  traversedModules: Set<ModuleNode>,
  boundaries: PropagationBoundary[],
  currentChain: ModuleNode[] = [node],
): HasDeadEnd {
  if (traversedModules.has(node)) {
    return false
  }
  traversedModules.add(node)

  // #7561
  // if the imports of `node` have not been analyzed, then `node` has not
  // been loaded in the browser and we should stop propagation.
  if (node.id && node.isSelfAccepting === undefined) {
    debugHmr?.(
      `[propagate update] stop propagation because not analyzed: ${colors.dim(
        node.id,
      )}`,
    )
    return false
  }

  if (node.isSelfAccepting) {
    boundaries.push({
      boundary: node,
      acceptedVia: node,
      isWithinCircularImport: isNodeWithinCircularImports(node, currentChain),
    })

    // additionally check for CSS importers, since a PostCSS plugin like
    // Tailwind JIT may register any file as a dependency to a CSS file.
    for (const importer of node.importers) {
      if (isCSSRequest(importer.url) && !currentChain.includes(importer)) {
        propagateUpdate(
          importer,
          traversedModules,
          boundaries,
          currentChain.concat(importer),
        )
      }
    }

    return false
  }

  // A partially accepted module with no importers is considered self accepting,
  // because the deal is "there are parts of myself I can't self accept if they
  // are used outside of me".
  // Also, the imported module (this one) must be updated before the importers,
  // so that they do get the fresh imported module when/if they are reloaded.
  if (node.acceptedHmrExports) {
    boundaries.push({
      boundary: node,
      acceptedVia: node,
      isWithinCircularImport: isNodeWithinCircularImports(node, currentChain),
    })
  } else {
    if (!node.importers.size) {
      return true
    }

    // #3716, #3913
    // For a non-CSS file, if all of its importers are CSS files (registered via
    // PostCSS plugins) it should be considered a dead end and force full reload.
    if (
      !isCSSRequest(node.url) &&
      [...node.importers].every((i) => isCSSRequest(i.url))
    ) {
      return true
    }
  }

  for (const importer of node.importers) {
    const subChain = currentChain.concat(importer)

    if (importer.acceptedHmrDeps.has(node)) {
      boundaries.push({
        boundary: importer,
        acceptedVia: node,
        isWithinCircularImport: isNodeWithinCircularImports(importer, subChain),
      })
      continue
    }

    if (node.id && node.acceptedHmrExports && importer.importedBindings) {
      const importedBindingsFromNode = importer.importedBindings.get(node.id)
      if (
        importedBindingsFromNode &&
        areAllImportsAccepted(importedBindingsFromNode, node.acceptedHmrExports)
      ) {
        continue
      }
    }

    if (
      !currentChain.includes(importer) &&
      propagateUpdate(importer, traversedModules, boundaries, subChain)
    ) {
      return true
    }
  }
  return false
}

/**
 * Check importers recursively if it's an import loop. An accepted module within
 * an import loop cannot recover its execution order and should be reloaded.
 *
 * @param node The node that accepts HMR and is a boundary
 * @param nodeChain The chain of nodes/imports that lead to the node.
 *   (The last node in the chain imports the `node` parameter)
 * @param currentChain The current chain tracked from the `node` parameter
 * @param traversedModules The set of modules that have traversed
 */
function isNodeWithinCircularImports(
  node: ModuleNode,
  nodeChain: ModuleNode[],
  currentChain: ModuleNode[] = [node],
  traversedModules = new Set<ModuleNode>(),
): boolean {
  // To help visualize how each parameters work, imagine this import graph:
  //
  // A -> B -> C -> ACCEPTED -> D -> E -> NODE
  //      ^--------------------------|
  //
  // ACCEPTED: the node that accepts HMR. the `node` parameter.
  // NODE    : the initial node that triggered this HMR.
  //
  // This function will return true in the above graph, which:
  // `node`         : ACCEPTED
  // `nodeChain`    : [NODE, E, D, ACCEPTED]
  // `currentChain` : [ACCEPTED, C, B]
  //
  // It works by checking if any `node` importers are within `nodeChain`, which
  // means there's an import loop with a HMR-accepted module in it.

  if (traversedModules.has(node)) {
    return false
  }
  traversedModules.add(node)

  for (const importer of node.importers) {
    // Node may import itself which is safe
    if (importer === node) continue

    // a PostCSS plugin like Tailwind JIT may register
    // any file as a dependency to a CSS file.
    // But in that case, the actual dependency chain is separate.
    if (isCSSRequest(importer.url)) continue

    // Check circular imports
    const importerIndex = nodeChain.indexOf(importer)
    if (importerIndex > -1) {
      // Log extra debug information so users can fix and remove the circular imports
      if (debugHmr) {
        // Following explanation above:
        // `importer`                    : E
        // `currentChain` reversed       : [B, C, ACCEPTED]
        // `nodeChain` sliced & reversed : [D, E]
        // Combined                      : [E, B, C, ACCEPTED, D, E]
        const importChain = [
          importer,
          ...[...currentChain].reverse(),
          ...nodeChain.slice(importerIndex, -1).reverse(),
        ]
        debugHmr(
          colors.yellow(`circular imports detected: `) +
            importChain.map((m) => colors.dim(m.url)).join(' -> '),
        )
      }
      return true
    }

    // Continue recursively
    if (!currentChain.includes(importer)) {
      const result = isNodeWithinCircularImports(
        importer,
        nodeChain,
        currentChain.concat(importer),
        traversedModules,
      )
      if (result) return result
    }
  }
  return false
}

export function handlePrunedModules(
  mods: Set<ModuleNode>,
  { hot }: ViteDevServer,
): void {
  // update the disposed modules' hmr timestamp
  // since if it's re-imported, it should re-apply side effects
  // and without the timestamp the browser will not re-import it!
  const t = Date.now()
  mods.forEach((mod) => {
    mod.lastHMRTimestamp = t
    mod.lastHMRInvalidationReceived = false
    debugHmr?.(`[dispose] ${colors.dim(mod.file)}`)
  })
  hot.send({
    type: 'prune',
    paths: [...mods].map((m) => m.url),
  })
}

const enum LexerState {
  inCall,
  inSingleQuoteString,
  inDoubleQuoteString,
  inTemplateString,
  inArray,
}

/**
 * Lex import.meta.hot.accept() for accepted deps.
 * Since hot.accept() can only accept string literals or array of string
 * literals, we don't really need a heavy @babel/parse call on the entire source.
 *
 * @returns selfAccepts
 */
export function lexAcceptedHmrDeps(
  code: string,
  start: number,
  urls: Set<{ url: string; start: number; end: number }>,
): boolean {
  let state: LexerState = LexerState.inCall
  // the state can only be 2 levels deep so no need for a stack
  let prevState: LexerState = LexerState.inCall
  let currentDep: string = ''

  function addDep(index: number) {
    urls.add({
      url: currentDep,
      start: index - currentDep.length - 1,
      end: index + 1,
    })
    currentDep = ''
  }

  for (let i = start; i < code.length; i++) {
    const char = code.charAt(i)
    switch (state) {
      case LexerState.inCall:
      case LexerState.inArray:
        if (char === `'`) {
          prevState = state
          state = LexerState.inSingleQuoteString
        } else if (char === `"`) {
          prevState = state
          state = LexerState.inDoubleQuoteString
        } else if (char === '`') {
          prevState = state
          state = LexerState.inTemplateString
        } else if (whitespaceRE.test(char)) {
          continue
        } else {
          if (state === LexerState.inCall) {
            if (char === `[`) {
              state = LexerState.inArray
            } else {
              // reaching here means the first arg is neither a string literal
              // nor an Array literal (direct callback) or there is no arg
              // in both case this indicates a self-accepting module
              return true // done
            }
          } else if (state === LexerState.inArray) {
            if (char === `]`) {
              return false // done
            } else if (char === ',') {
              continue
            } else {
              error(i)
            }
          }
        }
        break
      case LexerState.inSingleQuoteString:
        if (char === `'`) {
          addDep(i)
          if (prevState === LexerState.inCall) {
            // accept('foo', ...)
            return false
          } else {
            state = prevState
          }
        } else {
          currentDep += char
        }
        break
      case LexerState.inDoubleQuoteString:
        if (char === `"`) {
          addDep(i)
          if (prevState === LexerState.inCall) {
            // accept('foo', ...)
            return false
          } else {
            state = prevState
          }
        } else {
          currentDep += char
        }
        break
      case LexerState.inTemplateString:
        if (char === '`') {
          addDep(i)
          if (prevState === LexerState.inCall) {
            // accept('foo', ...)
            return false
          } else {
            state = prevState
          }
        } else if (char === '$' && code.charAt(i + 1) === '{') {
          error(i)
        } else {
          currentDep += char
        }
        break
      default:
        throw new Error('unknown import.meta.hot lexer state')
    }
  }
  return false
}

export function lexAcceptedHmrExports(
  code: string,
  start: number,
  exportNames: Set<string>,
): boolean {
  const urls = new Set<{ url: string; start: number; end: number }>()
  lexAcceptedHmrDeps(code, start, urls)
  for (const { url } of urls) {
    exportNames.add(url)
  }
  return urls.size > 0
}

export function normalizeHmrUrl(url: string): string {
  if (url[0] !== '.' && url[0] !== '/') {
    url = wrapId(url)
  }
  return url
}

function error(pos: number) {
  const err = new Error(
    `import.meta.hot.accept() can only accept string literals or an ` +
      `Array of string literals.`,
  ) as RollupError
  err.pos = pos
  throw err
}

// vitejs/vite#610 when hot-reloading Vue files, we read immediately on file
// change event and sometimes this can be too early and get an empty buffer.
// Poll until the file's modified time has changed before reading again.
async function readModifiedFile(file: string): Promise<string> {
  const content = await fsp.readFile(file, 'utf-8')
  if (!content) {
    const mtime = (await fsp.stat(file)).mtimeMs

    for (let n = 0; n < 10; n++) {
      await new Promise((r) => setTimeout(r, 10))
      const newMtime = (await fsp.stat(file)).mtimeMs
      if (newMtime !== mtime) {
        break
      }
    }

    return await fsp.readFile(file, 'utf-8')
  } else {
    return content
  }
}

/**
 * 创建一个热模块替换（HMR）广播器实例。
 * HMR广播器用于管理多个HMR通道，并支持跨这些通道进行事件广播和监听。
 * @returns {HMRBroadcaster} 返回一个HMR广播器实例。
 */
export function createHMRBroadcaster(): HMRBroadcaster {
  // 存储所有已添加的HMR通道。
  const channels: HMRChannel[] = []
  // 存储已准备好的HMR通道，即所有通道都已建立连接。
  const readyChannels = new WeakSet<HMRChannel>()
  // HMR广播器对象，提供管理通道和处理事件的方法。
  const broadcaster: HMRBroadcaster = {
    // 获取当前所有通道的列表。
    get channels() {
      return [...channels]
    },
    // 添加一个新的HMR通道。
    addChannel(channel) {
      // 检查是否已存在同名通道，若存在则抛出错误。
      if (channels.some((c) => c.name === channel.name)) {
        throw new Error(`HMR channel "${channel.name}" is already defined.`) // HMR 频道“${channel.name}”已定义
      }
      channels.push(channel)
      return broadcaster // 返回当前实例, 链式调用
    },
    // 注册一个事件监听器，当所有通道都已准备就绪时，特别处理'connection'事件。
    on(event: string, listener: (...args: any[]) => any) {
      // emit connection event only when all channels are ready 仅当所有通道准备就绪时才发出连接事件
      if (event === 'connection') {
        // make a copy so we don't wait for channels that might be added after this is triggered 制作副本，这样我们就不会等待触发后可能添加的频道
        const channels = this.channels
        channels.forEach((channel) =>
          channel.on('connection', () => {
            readyChannels.add(channel)
            if (channels.every((c) => readyChannels.has(c))) {
              listener()
            }
          }),
        )
        return
      }
      channels.forEach((channel) => channel.on(event, listener))
      return
    },
    // 移除指定事件的监听器。
    off(event, listener) {
      channels.forEach((channel) => channel.off(event, listener))
      return
    },
    // 向所有通道发送消息。
    send(...args: any[]) {
      channels.forEach((channel) => channel.send(...(args as [any])))
    },
    // 让所有通道开始监听。
    listen() {
      channels.forEach((channel) => channel.listen())
    },
    // 关闭所有通道。
    close() {
      return Promise.all(channels.map((channel) => channel.close()))
    },
  }
  return broadcaster
}

export interface ServerHMRChannel extends HMRChannel {
  api: {
    innerEmitter: EventEmitter
    outsideEmitter: EventEmitter
  }
}

/**
 * 创建一个服务器端热模块替换（HMR）通道。
 *
 * @returns {ServerHMRChannel} 返回一个符合 ServerHMRChannel 接口的对象，用于在服务器端进行HMR通信。
 */
export function createServerHMRChannel(): ServerHMRChannel {
  const innerEmitter = new EventEmitter() // 内部事件发射器，用于处理HMR内部事件
  const outsideEmitter = new EventEmitter() // 外部事件发射器，用于向客户端发送HMR消息

  // 返回一个包含HMR通道功能的对象
  return {
    name: 'ssr',
    /**
     * 向客户端发送HMR消息。
     *
     * @param {...any[]} args - 可变参数，支持两种调用方式：一种是字符串类型的消息类型和消息数据，另一种是预定义的HMR负载对象。
     */
    send(...args: any[]) {
      let payload: HMRPayload
      // 根据参数类型构造payload
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1],
        }
      } else {
        payload = args[0]
      }
      // 发送payload到外部事件发射器
      outsideEmitter.emit('send', payload)
    },
    /**
     * 移除指定事件的监听器。
     *
     * @param event - 事件名称。
     * @param listener - 监听器函数。
     */
    off(event, listener: () => void) {
      innerEmitter.off(event, listener)
    },
    /**
     * 监听指定事件。
     *
     * @param event - 事件名称。
     * @param listener - 监听器函数。
     * @returns 定义了on方法以符合ServerHMRChannel接口。
     */
    on: ((event: string, listener: () => unknown) => {
      innerEmitter.on(event, listener)
    }) as ServerHMRChannel['on'],
    /**
     * 关闭HMR通道，移除所有监听器。
     */
    close() {
      innerEmitter.removeAllListeners()
      outsideEmitter.removeAllListeners()
    },
    /**
     * 触发内部的连接事件，表示一个客户端已连接。
     */
    listen() {
      innerEmitter.emit('connection')
    },
    /**
     * 提供对内部和外部事件发射器的访问。
     */
    api: {
      innerEmitter,
      outsideEmitter,
    },
  }
}

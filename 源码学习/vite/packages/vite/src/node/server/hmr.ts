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

const normalizedClientDir = normalizePath(CLIENT_DIR) // D:/低代码/project/wzb/源码学习/vite/packages/vite/dist/client

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
  // 接受 HMR 更新的边界模块
  boundary: ModuleNode
  // 接受途径
  acceptedVia: ModuleNode
  // 在循环导入内
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

/**
 * 获取文件的短名称
 *
 * 如果文件路径以指定的根目录开始，则返回相对路径；否则返回原文件路径
 * 这个函数的目的是为了处理文件路径，使其更加简洁，尤其是在处理大量文件路径时
 *
 * @param file - 文件的完整路径
 * @param root - 根目录路径
 * @returns {string} - 文件的短名称或原路径
 */
export function getShortName(file: string, root: string): string {
  return file.startsWith(withTrailingSlash(root)) // 判断文件路径是否以根目录开始
    ? path.posix.relative(root, file) // 如果是，则使用posix路径计算相对路径
    : file // 如果不是，则直接返回原文件路径
}

/**
 * 处理热模块替换（HMR）更新
 *
 *  1. 检测变更文件是否为配置文件、配置文件的依赖或环境文件发生变更，则调用 restartServerWithUrls 方法自动重启服务器
 *  2. 如果文件是注入的 src/client 相关文件, 则不能热更新 -- 直接重新整页重载
 *  3. 获取受文件变更影响的模块集合
 *  4. 如果没有模块需要更新，则检查是否为 HTML 文件，是的话则进行整页重载
 */
export async function handleHMRUpdate(
  type: 'create' | 'delete' | 'update',
  file: string,
  server: ViteDevServer,
): Promise<void> {
  const { hot, config, moduleGraph } = server // 从服务器实例中提取变量: 热替换、配置和模块图相关属性
  const shortFile = getShortName(file, config.root) // 获取文件的简短名称 -- src/components/HelloWorld.vue

  // 判断是否是配置文件发生变更
  const isConfig = file === config.configFile
  // 判断是否是配置文件的依赖发生变更
  const isConfigDependency = config.configFileDependencies.some(
    (name) => file === name,
  )

  // 判断是否是环境文件发生变更
  const isEnv =
    config.inlineConfig.envFile !== false &&
    getEnvFilesForMode(config.mode, config.envDir).includes(file)

  // 如果是配置文件、配置文件的依赖或环境文件发生变更，则自动重启服务器
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server 自动重启服务器
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
  // 调试消息
  debugHmr?.(`[file change] ${colors.dim(shortFile)}`)

  // (dev only) the client itself cannot be hot updated. (dev only) 客户端本身不能热更新
  // 如果文件是注入的 src/client 相关文件, 则不能热更新
  if (file.startsWith(withTrailingSlash(normalizedClientDir))) {
    hot.send({
      type: 'full-reload',
      path: '*',
      triggeredBy: path.resolve(config.root, file),
    })
    return
  }

  // 获取受文件变更影响的模块集合 -- 单个文件可能对应于具有不同查询的多个模块
  const mods = new Set(moduleGraph.getModulesByFile(file))
  // 如果是创建操作，将有解析失败错误的模块添加到集合中
  // why?
  if (type === 'create') {
    for (const mod of moduleGraph._hasResolveFailedErrorModules) {
      mods.add(mod)
    }
  }
  // 如果是创建或删除操作，将受影响的全局模块添加到集合中 --  why?
  if (type === 'create' || type === 'delete') {
    for (const mod of getAffectedGlobModules(file, server)) {
      mods.add(mod)
    }
  }

  // check if any plugin wants to perform custom HMR handling 检查是否有任何插件想要执行自定义HMR处理
  const timestamp = Date.now()
  const hmrContext: HmrContext = {
    file, // "D:/低代码/project/wzb/源码学习/vite/playground/vue/src/components/HelloWorld.vue"
    timestamp, // 时间戳
    modules: [...mods], // 受影响的模块
    read: () => readModifiedFile(file),
    server, // 服务器实例
  }

  // 如果是更新操作，执行插件的 handleHotUpdate 钩子，在插件的 hook 钩子中, 可以重写受影响的模块
  if (type === 'update') {
    for (const hook of config.getSortedPluginHooks('handleHotUpdate')) {
      const filteredModules = await hook(hmrContext)
      if (filteredModules) {
        hmrContext.modules = filteredModules
      }
    }
  }

  // 如果没有模块需要更新，则检查是否为 HTML 文件，是的话则进行整页重载
  if (!hmrContext.modules.length) {
    // html file cannot be hot updated HTML文件不支持热更新
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
      // loaded but not in the module graph, probably not js 加载但不在模块图中，可能不是js
      debugHmr?.(`[no modules matched] ${colors.dim(shortFile)}`)
    }
    return
  }

  // 更新受影响的模块
  updateModules(shortFile, hmrContext.modules, timestamp, server)
}

type HasDeadEnd = boolean

/**
 * 更新模块
 *
 * 此函数用于处理模块更新逻辑，它根据提供的模块列表和相关配置来决定是进行部分更新还是完全重载页面
 *
 * @param file 触发更新的文件路径 -- "src/components/HelloWorld.vue"
 * @param modules 需要更新的模块列表
 * @param timestamp 更新的时间戳 -- 1724134880715
 * @param config, hot, moduleGraph Vite开发服务器的配置和对象
 * @param afterInvalidation 是否在模块失效后执行
 */
export function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, hot, moduleGraph }: ViteDevServer,
  afterInvalidation?: boolean,
): void {
  const updates: Update[] = [] // 存储所有更新信息的数组
  const invalidatedModules = new Set<ModuleNode>() // 存储失效模块的集合
  const traversedModules = new Set<ModuleNode>() // 存储已遍历模块的集合
  // Modules could be empty if a root module is invalidated via import.meta.hot.invalidate() 如果根模块通过 import.meta.hot.invalidate() 失效，则模块可能为空。
  let needFullReload: HasDeadEnd = modules.length === 0 // 如果模块列表为空，则表示需要完全重载页面
  // 遍历需要更新的模块 -- 找到对应传播边界: https://bjornlu.com/blog/hot-module-replacement-is-easy#whats-left
  for (const mod of modules) {
    const boundaries: PropagationBoundary[] = [] // 存储传播边界的数组
    const hasDeadEnd = propagateUpdate(mod, traversedModules, boundaries) // 判断更新是否会导致死端（无法继续传播）

    // 模块标记为无效状态
    moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true)

    // 如果需要重载页面, 退出当次循环 -- 为什么是退出当次循环了? 应该是需要遍历所有的模块,执行上面几个步骤
    if (needFullReload) {
      continue
    }

    // 标识为需要重载页面
    if (hasDeadEnd) {
      needFullReload = hasDeadEnd
      continue
    }

    // 将解析出来的 HMR 边界模块推入到 updates 中
    updates.push(
      ...boundaries.map(
        /**
         * boundary: HMR 边界模块
         * acceptedVia: ...
         * isWithinCircularImport: ...
         */
        ({ boundary, acceptedVia, isWithinCircularImport }) => ({
          // 接受更新模块的类型
          type: `${boundary.type}-update` as const,
          // 当次 HMR 更新时间戳
          timestamp,
          // HMR 边界模块的路径
          path: normalizeHmrUrl(boundary.url),
          acceptedPath: normalizeHmrUrl(acceptedVia.url),
          explicitImportRequired:
            boundary.type === 'js'
              ? isExplicitImportRequired(acceptedVia.url)
              : false,
          isWithinCircularImport,
          // browser modules are invalidated by changing ?t= query, 更改?t= query会使浏览器模块失效
          // but in ssr we control the module system, so we can directly remove them form cache 但在SSR中，我们控制模块系统，因此我们可以直接从缓存中删除它们
          ssrInvalidates: getSSRInvalidatedImporters(acceptedVia),
        }),
      ),
    )
  }

  // 如果需要完全重载页面
  if (needFullReload) {
    const reason =
      typeof needFullReload === 'string'
        ? colors.dim(` (${needFullReload})`)
        : ''
    // 记录日志并发送完全重载指令
    config.logger.info(
      colors.green(`page reload `) + colors.dim(file) + reason,
      { clear: !afterInvalidation, timestamp: true },
    )
    // 通知客户端重载页面
    hot.send({
      type: 'full-reload',
      triggeredBy: path.resolve(config.root, file),
    })
    return
  }

  // 如果没有更新信息
  if (updates.length === 0) {
    // 记录日志，表示没有更新发生
    debugHmr?.(colors.yellow(`no update happened `) + colors.dim(file))
    return
  }

  // 记录更新的日志并发送更新信息
  config.logger.info(
    colors.green(`hmr update `) +
      colors.dim([...new Set(updates.map((u) => u.path))].join(', ')),
    { clear: !afterInvalidation, timestamp: true },
  )
  // 通知客户端, HMR 更新事件
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

/**
 * 传播更新
 *
 * 该函数负责在模块热更新时，判断是否需要将更新传播到其他模块
 * 它通过遍历模块的导入者(importers)来实现更新的传播
 *
 * @param node 当前需要处理的模块
 * @param traversedModules 已经遍历过的模块集合，用于防止循环遍历
 * @param boundaries 更新传播边界数组，记录哪些模块接受了更新
 * @param currentChain 当前的模块链，用于检测循环导入
 * @returns 如果在传播过程中发现需要重新加载页面，则返回 true；否则返回 false
 */
function propagateUpdate(
  node: ModuleNode,
  traversedModules: Set<ModuleNode>,
  boundaries: PropagationBoundary[],
  currentChain: ModuleNode[] = [node],
): HasDeadEnd {
  // 检查当前模块是否已遍历，避免循环遍历
  if (traversedModules.has(node)) {
    return false
  }
  traversedModules.add(node) // 添加进遍历过的模块集合，用于防止循环遍历

  // #7561
  // if the imports of `node` have not been analyzed, then `node` has not 如果没有分析' node '的导入，那么' node '也没有分析
  // been loaded in the browser and we should stop propagation. 在浏览器中加载，我们应该停止传播
  if (node.id && node.isSelfAccepting === undefined) {
    debugHmr?.(
      // [传播更新]停止传播，因为没有分析
      `[propagate update] stop propagation because not analyzed: ${colors.dim(
        node.id,
      )}`,
    )
    return false
  }

  // 如果模块接收模块自身: 传播边界为自身 --- https://cn.vitejs.dev/guide/api-hmr#hot-accept-cb
  if (node.isSelfAccepting) {
    boundaries.push({
      boundary: node,
      acceptedVia: node,
      isWithinCircularImport: isNodeWithinCircularImports(node, currentChain),
    })

    // additionally check for CSS importers, since a PostCSS plugin like 另外检查CSS导入器，因为PostCSS插件像
    // Tailwind JIT may register any file as a dependency to a CSS file. Tailwind JIT 可以将任何文件注册为CSS文件的依赖项
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

  // A partially accepted module with no importers is considered self accepting, 没有导入器的部分可接受模块被认为是自接受的
  // because the deal is "there are parts of myself I can't self accept if they 因为交易是“我自己的某些部分我无法自我接受，如果他们
  // are used outside of me". 是用在我之外的吗
  // Also, the imported module (this one) must be updated before the importers, 此外，导入的模块(这个)必须在导入器之前更新
  // so that they do get the fresh imported module when/if they are reloaded. 这样，当/如果它们被重新加载时，它们就会获得新导入的模块
  if (node.acceptedHmrExports) {
    boundaries.push({
      boundary: node,
      acceptedVia: node,
      isWithinCircularImport: isNodeWithinCircularImports(node, currentChain),
    })
  } else {
    // 如果模块没有导入者，则无需进一步处理。直接返回 true, 那么就会通知客户端重新加载页面
    if (!node.importers.size) {
      return true
    }

    // #3716, #3913
    // For a non-CSS file, if all of its importers are CSS files (registered via 对于一个非CSS文件，如果它的所有导入器都是CSS文件(通过
    // PostCSS plugins) it should be considered a dead end and force full reload. PostCSS插件)，它应该被认为是一个死胡同，并强制完全重新加载
    if (
      !isCSSRequest(node.url) && // 是否为 css(或 scss 等) 文件请求
      [...node.importers].every((i) => isCSSRequest(i.url)) // 检测所有的导入者是否都是 css 文件
    ) {
      return true
    }
  }

  // 遍历模块的导入者
  for (const importer of node.importers) {
    const subChain = currentChain.concat(importer) // 当前的模块链，用于检测循环导入

    // 如果导入者已接受当前模块的更新，则无需进一步处理 -- 调用 hot.accept(deps, cb) 接受直接依赖项的更新 -- https://cn.vitejs.dev/guide/api-hmr#hot-accept-deps-cb
    if (importer.acceptedHmrDeps.has(node)) {
      boundaries.push({
        boundary: importer,
        acceptedVia: node,
        isWithinCircularImport: isNodeWithinCircularImports(importer, subChain),
      })
      continue
    }

    // 根据导入者和当前模块的绑定关系判断是否需要进一步处理
    if (node.id && node.acceptedHmrExports && importer.importedBindings) {
      const importedBindingsFromNode = importer.importedBindings.get(node.id)
      if (
        importedBindingsFromNode &&
        areAllImportsAccepted(importedBindingsFromNode, node.acceptedHmrExports)
      ) {
        continue
      }
    }

    // 递归处理导入者
    if (
      !currentChain.includes(importer) && // 如果导入链已经包含了这个导入者, 循环导入, 那么就不跳过处理
      propagateUpdate(importer, traversedModules, boundaries, subChain) // 递归处理
    ) {
      return true
    }
  }
  return false
}

/**
 * Check importers recursively if it's an import loop. An accepted module within 如果是导入循环，则递归检查导入器。一个可接受的模块
 * an import loop cannot recover its execution order and should be reloaded. 导入循环无法恢复其执行顺序，应重新加载
 *
 * @param node The node that accepts HMR and is a boundary 接受HMR的节点，是一个边界
 * @param nodeChain The chain of nodes/imports that lead to the node. 指向该节点的节点/导入链
 *   (The last node in the chain imports the `node` parameter) 链中的最后一个节点导入' node '参数
 * @param currentChain The current chain tracked from the `node` parameter 从' node '参数跟踪的当前链
 * @param traversedModules The set of modules that have traversed 已遍历的模块集
 */
function isNodeWithinCircularImports(
  node: ModuleNode, // 接受更新的模块
  nodeChain: ModuleNode[], // 导入链
  currentChain: ModuleNode[] = [node],
  traversedModules = new Set<ModuleNode>(),
): boolean {
  // To help visualize how each parameters work, imagine this import graph: 为了帮助理解每个参数的作用，可以想象下面的导入图：
  //
  // A -> B -> C -> ACCEPTED -> D -> E -> NODE
  //      ^--------------------------|
  //
  // ACCEPTED: the node that accepts HMR. the `node` parameter. 接受HMR的节点，即参数`node`。
  // NODE    : the initial node that triggered this HMR. 触发本次HMR的初始节点。
  //
  // This function will return true in the above graph, which: 该函数将在上述图中返回true，其中：
  // `node`         : ACCEPTED
  // `nodeChain`    : [NODE, E, D, ACCEPTED]
  // `currentChain` : [ACCEPTED, C, B]
  //
  // It works by checking if any `node` importers are within `nodeChain`, which 它的工作原理是检查是否有任何“节点”进口商在“节点链”，其中
  // means there's an import loop with a HMR-accepted module in it. 意味着有一个包含HMR接受模块的导入循环

  // 如果模块已遍历过，则直接返回false
  if (traversedModules.has(node)) {
    return false
  }
  traversedModules.add(node)

  // 遍历当前模块的所有导入者
  for (const importer of node.importers) {
    // Node may import itself which is safe Node可以导入自己，这是安全的
    if (importer === node) continue

    // a PostCSS plugin like Tailwind JIT may register 像 Tailwind JIT 这样的PostCSS插件可以注册
    // any file as a dependency to a CSS file. 任何文件作为CSS文件的依赖
    // But in that case, the actual dependency chain is separate. 但是在这种情况下，实际的依赖链是分开的
    // 跳过PostCSS插件注册的CSS文件依赖
    if (isCSSRequest(importer.url)) continue

    // Check circular imports 检查循环导入
    const importerIndex = nodeChain.indexOf(importer)
    if (importerIndex > -1) {
      // Log extra debug information so users can fix and remove the circular imports 记录额外的调试信息，以便用户可以修复和删除循环导入
      if (debugHmr) {
        // Following explanation above: 按照上面的解释
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

    // Continue recursively 继续递归
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
 *
 * 这些通道支持 on、off、send 等方法, 服务器实例内置的就是一个 ws 服务器
 * 当发生 HMR 时, 会调用 send 通知所有的通道, 这样内置的 ws 服务器就会通知客户端执行对应的机制
 *
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

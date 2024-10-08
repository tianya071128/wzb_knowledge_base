import { extname } from 'node:path'
import type { ModuleInfo, PartialResolvedId } from 'rollup'
import { isDirectCSSRequest } from '../plugins/css'
import {
  normalizePath,
  removeImportQuery,
  removeTimestampQuery,
} from '../utils'
import { FS_PREFIX } from '../constants'
import { cleanUrl } from '../../shared/utils'
import type { TransformResult } from './transformRequest'

// 模块实例类
export class ModuleNode {
  /**
   * Public served url path, starts with /
   */
  url: string
  /**
   * Resolved file system path + query
   */
  id: string | null = null
  file: string | null = null
  type: 'js' | 'css'
  info?: ModuleInfo
  meta?: Record<string, any>
  importers = new Set<ModuleNode>()
  clientImportedModules = new Set<ModuleNode>()
  ssrImportedModules = new Set<ModuleNode>()
  acceptedHmrDeps = new Set<ModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  importedBindings: Map<string, Set<string>> | null = null
  /** 模式是否接受自身更新 -- https://cn.vitejs.dev/guide/api-hmr#hot-accept-cb */
  isSelfAccepting?: boolean
  /** 模块的 transform 结果, 最终提供给用户的结果值 */
  transformResult: TransformResult | null = null
  ssrTransformResult: TransformResult | null = null
  ssrModule: Record<string, any> | null = null
  ssrError: Error | null = null
  lastHMRTimestamp = 0
  /**
   * `import.meta.hot.invalidate` is called by the client. 是由客户端调用的
   * If there's multiple clients, multiple `invalidate` request is received. 如果有多个客户端，则会接收多个'invalidate'请求
   * This property is used to dedupe those request to avoid multiple updates happening. 此属性用于删除这些请求，以避免发生多次更新
   * @internal
   */
  lastHMRInvalidationReceived = false
  lastInvalidationTimestamp = 0
  /**
   * If the module only needs to update its imports timestamp (e.g. within an HMR chain), 如果模块只需要更新它的导入时间戳(例如在HMR链中)，
   * it is considered soft-invalidated. In this state, its `transformResult` should exist, 它被认为是软无效的。在这种状态下，它的“转换结果”应该存在
   * and the next `transformRequest` for this module will replace the timestamps. 这个模块的下一个 'transformRequest' 将替换时间戳
   *
   * By default the value is `undefined` if it's not soft/hard-invalidated. If it gets 默认情况下，如果不是软/硬无效，则值为' undefined '。如果它得到
   * soft-invalidated, this will contain the previous `transformResult` value. If it gets soft-invalidated，这将包含先前的' transformResult '值。如果它得到
   * hard-invalidated, this will be set to `'HARD_INVALIDATED'`. hard-invalidated，这将被设置为“HARD_INVALIDATED”。
   * @internal
   */
  invalidationState: TransformResult | 'HARD_INVALIDATED' | undefined
  /**
   * @internal
   */
  ssrInvalidationState: TransformResult | 'HARD_INVALIDATED' | undefined
  /**
   * The module urls that are statically imported in the code. This information is separated
   * out from `importedModules` as only importers that statically import the module can be
   * soft invalidated. Other imports (e.g. watched files) needs the importer to be hard invalidated.
   * @internal
   */
  staticImportedUrls?: Set<string>

  /**
   * @param setIsSelfAccepting - set `false` to set `isSelfAccepting` later. e.g. #7870
   */
  constructor(url: string, setIsSelfAccepting = true) {
    this.url = url
    this.type = isDirectCSSRequest(url) ? 'css' : 'js'
    if (setIsSelfAccepting) {
      this.isSelfAccepting = false
    }
  }

  get importedModules(): Set<ModuleNode> {
    const importedModules = new Set(this.clientImportedModules)
    for (const module of this.ssrImportedModules) {
      importedModules.add(module)
    }
    return importedModules
  }
}

export type ResolvedUrl = [
  url: string,
  resolvedId: string,
  meta: object | null | undefined,
]

export class ModuleGraph {
  /** url 与 模块实例 */
  urlToModuleMap = new Map<string, ModuleNode>()
  /** 模块id 与 模块实例 */
  idToModuleMap = new Map<string, ModuleNode>()
  /** 模块的 ETag 与 模块实例 */
  etagToModuleMap = new Map<string, ModuleNode>()
  // a single file may corresponds to multiple modules with different queries 单个文件可能对应于具有不同查询的多个模块
  fileToModulesMap = new Map<string, Set<ModuleNode>>()
  safeModulesPath = new Set<string>()

  /**
   * url 与未解析的模块映射关系
   * @internal
   */
  _unresolvedUrlToModuleMap = new Map<
    string,
    Promise<ModuleNode> | ModuleNode
  >()
  /**
   * @internal
   */
  _ssrUnresolvedUrlToModuleMap = new Map<
    string,
    Promise<ModuleNode> | ModuleNode
  >()

  /** @internal */
  _hasResolveFailedErrorModules = new Set<ModuleNode>()

  constructor(
    private resolveId: (
      url: string,
      ssr: boolean,
    ) => Promise<PartialResolvedId | null>,
  ) {}

  // 根据URL异步获取模块对象。
  async getModuleByUrl(
    rawUrl: string,
    ssr?: boolean,
  ): Promise<ModuleNode | undefined> {
    // Quick path, if we already have a module for this rawUrl (even without extension) 快速路径，如果我们已经有这个 rawUrl 的模块（即使没有扩展名）
    rawUrl = removeImportQuery(removeTimestampQuery(rawUrl)) // 移除一些内容, 得到原始的 url --> '/src/main.js'
    // 尝试获取一个未解析的URL对应的模块，如果存在则直接返回
    const mod = this._getUnresolvedUrlToModule(rawUrl, ssr)
    // 如果存在的话，直接返回
    if (mod) {
      return mod
    }

    const [url] = await this._resolveUrl(rawUrl, ssr) // 解析一下 url
    return this.urlToModuleMap.get(url) // 尝试从 map 中获取一下模块
  }

  /**
   * 根据模块ID获取模块实例。
   *
   * 此方法旨在通过模块ID检索特定的模块节点。它首先对ID进行处理，移除时间戳查询，
   * 然后尝试从ID到模块的映射中获取对应的模块节点。如果映射中存在该ID，则返回对应的模块节点，
   * 否则返回undefined。
   *
   * @param id 模块的唯一标识符。这个标识符可能包含一个时间戳查询部分，该部分在查找过程中被移除。
   * @returns {ModuleNode | undefined} 如果找到对应的模块节点，则返回该节点；如果未找到，则返回undefined。
   */
  getModuleById(id: string): ModuleNode | undefined {
    // 移除ID中的时间戳查询部分，以便进行映射查找
    return this.idToModuleMap.get(removeTimestampQuery(id))
  }

  /**
   * 根据文件名获取关联的模块节点集合
   *
   * 此方法用于从一个内部的映射（Map）中检索与特定文件相关联的模块节点集合
   * 它提供了一种快速的方式来获取文件关联的模块信息，而不需要遍历整个模块图
   *
   * @param file 想要查询的文件名
   * @returns 如果文件存在于映射中，则返回对应的模块节点集合（Set）；如果文件不存在于映射中，则返回undefined
   */
  getModulesByFile(file: string): Set<ModuleNode> | undefined {
    return this.fileToModulesMap.get(file)
  }

  // 监听文件变化回调,
  onFileChange(file: string): void {
    // 判断监听的文件是否已经构建过
    const mods = this.getModulesByFile(file)
    if (mods) {
      // 将模块置为失效
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        this.invalidateModule(mod, seen)
      })
    }
  }

  onFileDelete(file: string): void {
    const mods = this.getModulesByFile(file)
    if (mods) {
      mods.forEach((mod) => {
        mod.importedModules.forEach((importedMod) => {
          importedMod.importers.delete(mod)
        })
      })
    }
  }

  /**
   * 标记模块为无效，并递归模块的导入者置为失效
   *  1. 当文件变化时, 那么就需要标记为无效
   * @param mod 要处理的模块节点。
   * @param seen 一个集合，用于追踪已经处理过的模块节点，防止循环引用。
   * @param timestamp 无效化操作的时间戳，默认为当前时间。
   * @param isHmr 表示是否是热模块替换操作，默认为false。
   * @param softInvalidate 内部使用，表示是否是软无效化，默认为false。
   */
  invalidateModule(
    mod: ModuleNode,
    seen: Set<ModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
    /** @internal */
    softInvalidate = false,
  ): void {
    const prevInvalidationState = mod.invalidationState // 模块的先前无效化状态
    const prevSsrInvalidationState = mod.ssrInvalidationState

    // Handle soft invalidation before the `seen` check, as consecutive soft/hard invalidations can 在' seen '检查之前处理软失效，就像连续的软/硬失效一样
    // cause the final soft invalidation state to be different. 导致最终的软失效状态不同
    // If soft invalidated, save the previous `transformResult` so that we can reuse and transform the 如果软无效，保存之前的“transformResult”，以便我们可以重用和转换
    // import timestamps only in `transformRequest`. If there's no previous `transformResult`, hard invalidate it. 只在' transformRequest '中导入时间戳。如果之前没有' transformRequest '，很难使它无效
    if (softInvalidate) {
      mod.invalidationState ??= mod.transformResult ?? 'HARD_INVALIDATED'
      mod.ssrInvalidationState ??= mod.ssrTransformResult ?? 'HARD_INVALIDATED'
    }
    // If hard invalidated, further soft invalidations have no effect until it's reset to `undefined` 如果硬无效，则在将其重置为“undefined”之前，进一步的软无效将不起作用。
    else {
      mod.invalidationState = 'HARD_INVALIDATED'
      mod.ssrInvalidationState = 'HARD_INVALIDATED'
    }

    // Skip updating the module if it was already invalidated before and the invalidation state has not changed 如果模块之前已经失效且失效状态没有改变，则跳过更新模块
    if (
      seen.has(mod) &&
      prevInvalidationState === mod.invalidationState &&
      prevSsrInvalidationState === mod.ssrInvalidationState
    ) {
      return
    }
    seen.add(mod)

    // 根据是否是HMR操作，更新时间戳和相关状态
    if (isHmr) {
      mod.lastHMRTimestamp = timestamp
      mod.lastHMRInvalidationReceived = false
    } else {
      // Save the timestamp for this invalidation, so we can avoid caching the result of possible already started 保存这个无效的时间戳，这样我们就可以避免缓存可能已经开始的结果
      // processing being done for this module 该模块正在进行的处理
      mod.lastInvalidationTimestamp = timestamp
    }

    // Don't invalidate mod.info and mod.meta, as they are part of the processing pipeline 不要使mod.info和mod.meta无效，因为它们是处理管道的一部分
    // Invalidating the transform result is enough to ensure this module is re-processed next time it is requested 使转换结果无效足以确保在下次请求该模块时对其进行重新处理
    const etag = mod.transformResult?.etag // 模块的 etag, 清除
    if (etag) this.etagToModuleMap.delete(etag)

    // 清除模块的处理结果和SSR相关信息
    mod.transformResult = null
    mod.ssrTransformResult = null
    mod.ssrModule = null
    mod.ssrError = null

    // 遍历并处理模块的导入者
    // why? -- 猜测: 当将当前模块的导入者也置为失效, 重新请求时, 就需要重新构建, 这样构建保证是最新的
    mod.importers.forEach((importer) => {
      if (!importer.acceptedHmrDeps.has(mod)) {
        // If the importer statically imports the current module, we can soft-invalidate the importer 如果导入器静态导入当前模块，我们可以使导入器软失效
        // to only update the import timestamps. If it's not statically imported, e.g. watched/glob file, 只更新导入时间戳。如果它不是静态导入的，例如观看/glob文件
        // we can only soft invalidate if the current module was also soft-invalidated. A soft-invalidation 如果当前模块也是软失效的，我们只能软失效。软失效
        // doesn't need to trigger a re-load and re-transform of the importer. 不需要触发导入器的重新加载和重新转换
        const shouldSoftInvalidateImporter =
          importer.staticImportedUrls?.has(mod.url) || softInvalidate
        this.invalidateModule(
          importer,
          seen,
          timestamp,
          isHmr,
          shouldSoftInvalidateImporter,
        )
      }
    })

    // 删除模块的解析失败错误状态
    this._hasResolveFailedErrorModules.delete(mod)
  }

  invalidateAll(): void {
    const timestamp = Date.now()
    const seen = new Set<ModuleNode>()
    this.idToModuleMap.forEach((mod) => {
      this.invalidateModule(mod, seen, timestamp)
    })
  }

  /**
   * Update the module graph based on a module's updated imports information
   * If there are dependencies that no longer have any importers, they are
   * returned as a Set.
   *
   * @param staticImportedUrls Subset of `importedModules` where they're statically imported in code.
   *   This is only used for soft invalidations so `undefined` is fine but may cause more runtime processing.
   */
  async updateModuleInfo(
    mod: ModuleNode,
    importedModules: Set<string | ModuleNode>,
    importedBindings: Map<string, Set<string>> | null,
    acceptedModules: Set<string | ModuleNode>,
    acceptedExports: Set<string> | null,
    isSelfAccepting: boolean,
    ssr?: boolean,
    /** @internal */
    staticImportedUrls?: Set<string>,
  ): Promise<Set<ModuleNode> | undefined> {
    mod.isSelfAccepting = isSelfAccepting
    const prevImports = ssr ? mod.ssrImportedModules : mod.clientImportedModules
    let noLongerImported: Set<ModuleNode> | undefined

    let resolvePromises = []
    let resolveResults = new Array(importedModules.size)
    let index = 0
    // update import graph
    for (const imported of importedModules) {
      const nextIndex = index++
      if (typeof imported === 'string') {
        resolvePromises.push(
          this.ensureEntryFromUrl(imported, ssr).then((dep) => {
            dep.importers.add(mod)
            resolveResults[nextIndex] = dep
          }),
        )
      } else {
        imported.importers.add(mod)
        resolveResults[nextIndex] = imported
      }
    }

    if (resolvePromises.length) {
      await Promise.all(resolvePromises)
    }

    const nextImports = new Set(resolveResults)
    if (ssr) {
      mod.ssrImportedModules = nextImports
    } else {
      mod.clientImportedModules = nextImports
    }

    // remove the importer from deps that were imported but no longer are.
    prevImports.forEach((dep) => {
      if (
        !mod.clientImportedModules.has(dep) &&
        !mod.ssrImportedModules.has(dep)
      ) {
        dep.importers.delete(mod)
        if (!dep.importers.size) {
          // dependency no longer imported
          ;(noLongerImported || (noLongerImported = new Set())).add(dep)
        }
      }
    })

    // update accepted hmr deps
    resolvePromises = []
    resolveResults = new Array(acceptedModules.size)
    index = 0
    for (const accepted of acceptedModules) {
      const nextIndex = index++
      if (typeof accepted === 'string') {
        resolvePromises.push(
          this.ensureEntryFromUrl(accepted, ssr).then((dep) => {
            resolveResults[nextIndex] = dep
          }),
        )
      } else {
        resolveResults[nextIndex] = accepted
      }
    }

    if (resolvePromises.length) {
      await Promise.all(resolvePromises)
    }

    mod.acceptedHmrDeps = new Set(resolveResults)
    mod.staticImportedUrls = staticImportedUrls

    // update accepted hmr exports
    mod.acceptedHmrExports = acceptedExports
    mod.importedBindings = importedBindings
    return noLongerImported
  }

  async ensureEntryFromUrl(
    rawUrl: string,
    ssr?: boolean,
    setIsSelfAccepting = true,
  ): Promise<ModuleNode> {
    return this._ensureEntryFromUrl(rawUrl, ssr, setIsSelfAccepting)
  }

  /**
   * 确保从URL创建或获取一个模块实例。
   *
   * 此函数的目的是为了确保给定的URL对应有一个模块节点。它首先尝试从缓存中获取已解析的URL对应的模块节点，
   * 如果不存在，则通过解析URL来创建一个新的模块节点，并将其注册到相关的映射表中。
   *
   * @param rawUrl 需要被解析的原始URL。
   * @param ssr 是否适用于服务器端渲染，默认为undefined。
   * @param setIsSelfAccepting 是否设置模块节点为自接受，默认为true。
   * @param resolved 已部分解析的ID，用于优化解析过程，可选。
   * @returns 返回一个Promise，解析为对应的模块节点。
   */
  async _ensureEntryFromUrl(
    rawUrl: string,
    ssr?: boolean,
    setIsSelfAccepting = true,
    // Optimization, avoid resolving the same url twice if the caller already did it 优化，如果调用者已经解析过相同的 url，则避免两次解析
    resolved?: PartialResolvedId,
  ): Promise<ModuleNode> {
    // Quick path, if we already have a module for this rawUrl (even without extension) 快速路径，如果我们已经有这个 rawUrl 的模块（即使没有扩展名）
    rawUrl = removeImportQuery(removeTimestampQuery(rawUrl)) // 移除URL中的查询参数和时间戳，以获得标准化的URL。
    // 尝试从未解析的URL到模块的映射中获取模块节点，如果存在则直接返回。
    let mod = this._getUnresolvedUrlToModule(rawUrl, ssr)
    if (mod) {
      return mod
    }
    // 异步函数，用于解析URL并创建或获取对应的模块节点。
    const modPromise = (async () => {
      // 解析URL，获取标准化的URL、解析后的ID和元数据。
      const [url, resolvedId, meta] = await this._resolveUrl(
        rawUrl,
        ssr,
        resolved,
      )
      // 尝试从ID到模块的映射中获取模块节点，
      mod = this.idToModuleMap.get(resolvedId)
      // 如果不存在则创建一个新的模块节点。
      if (!mod) {
        // 创建一个新的模块实例
        mod = new ModuleNode(url, setIsSelfAccepting)
        if (meta) mod.meta = meta
        // 多个url可以映射到同一个模块和id，请确保我们注册
        // 此时使用 url 与 模块实例 的映射
        this.urlToModuleMap.set(url, mod)
        mod.id = resolvedId // 模块id
        this.idToModuleMap.set(resolvedId, mod) // 存储到对应集合中
        const file = (mod.file = cleanUrl(resolvedId)) // 文件路径："D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/src/main.js"
        // 根据文件路径添加到 fileToModulesMap 映射中
        let fileMappedModules = this.fileToModulesMap.get(file)
        if (!fileMappedModules) {
          fileMappedModules = new Set()
          this.fileToModulesMap.set(file, fileMappedModules)
        }
        fileMappedModules.add(mod)
      }
      // multiple urls can map to the same module and id, make sure we register 多个url可以映射到同一个模块和id，请确保我们注册
      // the url to the existing module in that case 在这种情况下，现有模块的url
      else if (!this.urlToModuleMap.has(url)) {
        this.urlToModuleMap.set(url, mod)
      }
      // 将原始URL与模块节点关联起来，用于缓存。
      this._setUnresolvedUrlToModule(rawUrl, mod, ssr)
      return mod
    })()

    // Also register the clean url to the module, so that we can short-circuit 同时将 clean url 注册到模块中，这样我们就可以短路
    // resolving the same url twice 两次解析同一个url
    this._setUnresolvedUrlToModule(rawUrl, modPromise, ssr)
    return modPromise
  }

  // some deps, like a css file referenced via @import, don't have its own
  // url because they are inlined into the main css import. But they still
  // need to be represented in the module graph so that they can trigger
  // hmr in the importing css file.
  createFileOnlyEntry(file: string): ModuleNode {
    file = normalizePath(file)
    let fileMappedModules = this.fileToModulesMap.get(file)
    if (!fileMappedModules) {
      fileMappedModules = new Set()
      this.fileToModulesMap.set(file, fileMappedModules)
    }

    const url = `${FS_PREFIX}${file}`
    for (const m of fileMappedModules) {
      if (m.url === url || m.id === file) {
        return m
      }
    }

    const mod = new ModuleNode(url)
    mod.file = file
    fileMappedModules.add(mod)
    return mod
  }

  // for incoming urls, it is important to:
  // 1. remove the HMR timestamp query (?t=xxxx) and the ?import query
  // 2. resolve its extension so that urls with or without extension all map to
  // the same module
  async resolveUrl(url: string, ssr?: boolean): Promise<ResolvedUrl> {
    url = removeImportQuery(removeTimestampQuery(url))
    const mod = await this._getUnresolvedUrlToModule(url, ssr)
    if (mod?.id) {
      return [mod.url, mod.id, mod.meta]
    }
    return this._resolveUrl(url, ssr)
  }

  // 根据模块的 Etag 来更新模块的转换结果。
  updateModuleTransformResult(
    mod: ModuleNode,
    result: TransformResult | null,
    ssr: boolean,
  ): void {
    // 根据SSR模式，更新模块的转换结果
    if (ssr) {
      mod.ssrTransformResult = result
    } else {
      // 如果之前有转换结果的ETag，从映射中删除该模块
      const prevEtag = mod.transformResult?.etag
      if (prevEtag) this.etagToModuleMap.delete(prevEtag)

      // 更新模块的转换结果
      mod.transformResult = result

      // 如果新的转换结果有ETag，将模块映射到ETag
      if (result?.etag) this.etagToModuleMap.set(result.etag, mod)
    }
  }
  // 根据ETag获取模块实例。
  getModuleByEtag(etag: string): ModuleNode | undefined {
    return this.etagToModuleMap.get(etag)
  }

  /**
   * 根据URL获取未解析的模块映射。
   * @internal
   */
  _getUnresolvedUrlToModule(
    url: string,
    ssr?: boolean,
  ): Promise<ModuleNode> | ModuleNode | undefined {
    // 根据SSR参数选择正确的映射表，并尝试从映射表中获取对应的模块节点。
    return (
      ssr ? this._ssrUnresolvedUrlToModuleMap : this._unresolvedUrlToModuleMap
    ).get(url)
  }
  /**
   * 根据URL和模块类型，设置未解析的URL到模块的映射。
   * 此函数用于内部管理，旨在区分SSR（服务器端渲染）和非SSR场景下模块的未解析URL映射。
   *
   * @param url 模块的未解析URL字符串。
   * @param mod 一个Promise包装的模块节点或直接的模块节点对象。
   * @param ssr 可选参数，指示当前操作是否针对SSR场景。如果未提供，则默认为false。
   */
  _setUnresolvedUrlToModule(
    url: string,
    mod: Promise<ModuleNode> | ModuleNode,
    ssr?: boolean,
  ): void {
    // 根据ssr参数的值，选择将未解析的URL到模块的映射存储在SSR映射表或客户端映射表中
    ;(ssr
      ? this._ssrUnresolvedUrlToModuleMap
      : this._unresolvedUrlToModuleMap
    ).set(url, mod)
  }

  /**
   * 根据给定的URL和SSR状态，解析URL并返回解析后的结果。
   *
   * 此函数的目的是为了在构建过程中，将相对或绝对路径转换为完全解析的ID，
   * 并处理可能的文件扩展名匹配问题。它支持SSR（服务器端渲染）的配置，
   * 并考虑了特殊字符和虚拟模块的情况。
   *
   * @param url 需要解析的URL字符串。
   * @param ssr 是否在服务器端渲染的上下文中解析URL。
   * @param alreadyResolved 如果已经解析过ID，可以提供部分解析的结果以避免重复解析。
   * @returns 返回一个包含解析后的URL、解析后的ID和元信息的Promise对象。
   * @internal
   */
  async _resolveUrl(
    url: string,
    ssr?: boolean,
    alreadyResolved?: PartialResolvedId,
  ): Promise<ResolvedUrl> {
    // 使用已解析的ID或尝试解析给定的URL
    const resolved = alreadyResolved ?? (await this.resolveId(url, !!ssr)) // 通过 resolveId 获取解析后的 id
    const resolvedId = resolved?.id || url
    if (
      url !== resolvedId &&
      !url.includes('\0') &&
      !url.startsWith(`virtual:`)
    ) {
      const ext = extname(cleanUrl(resolvedId)) // 文件后缀
      if (ext) {
        const pathname = cleanUrl(url)
        if (!pathname.endsWith(ext)) {
          url = pathname + ext + url.slice(pathname.length)
        }
      }
    }
    return [url, resolvedId, resolved?.meta]
  }
}

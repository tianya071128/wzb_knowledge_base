import colors from 'picocolors'
import { createDebugger, getHash, promiseWithResolvers } from '../utils'
import type { PromiseWithResolvers } from '../utils'
import { getDepOptimizationConfig } from '../config'
import type { ResolvedConfig, ViteDevServer } from '..'
import {
  addManuallyIncludedOptimizeDeps,
  addOptimizedDepInfo,
  createIsOptimizedDepFile,
  createIsOptimizedDepUrl,
  depsFromOptimizedDepInfo,
  depsLogString,
  discoverProjectDependencies,
  extractExportsData,
  getOptimizedDepPath,
  initDepsOptimizerMetadata,
  loadCachedDepOptimizationMetadata,
  optimizeServerSsrDeps,
  runOptimizeDeps,
  toDiscoveredDependencies,
} from '.'
import type { DepOptimizationResult, DepsOptimizer, OptimizedDepInfo } from '.'

const debug = createDebugger('vite:deps')

/**
 * The amount to wait for requests to register newly found dependencies before triggering 在触发之前等待注册新发现的依赖项的请求的时间
 * a re-bundle + page reload 重新捆绑 + 页面重新加载
 */
const debounceMs = 100

const depsOptimizerMap = new WeakMap<ResolvedConfig, DepsOptimizer>()
const devSsrDepsOptimizerMap = new WeakMap<ResolvedConfig, DepsOptimizer>()

// 根据指定配置对象获取预构建依赖优化器
export function getDepsOptimizer(
  config: ResolvedConfig,
  ssr?: boolean,
): DepsOptimizer | undefined {
  return (ssr ? devSsrDepsOptimizerMap : depsOptimizerMap).get(config)
}

// 初始化依赖优化器。
export async function initDepsOptimizer(
  config: ResolvedConfig,
  server: ViteDevServer,
): Promise<void> {
  // 检查依赖优化器是否已存在，若不存在则创建
  if (!getDepsOptimizer(config, false)) {
    await createDepsOptimizer(config, server)
  }
}

let creatingDevSsrOptimizer: Promise<void> | undefined
export async function initDevSsrDepsOptimizer(
  config: ResolvedConfig,
  server: ViteDevServer,
): Promise<void> {
  if (getDepsOptimizer(config, true)) {
    // ssr
    return
  }
  if (creatingDevSsrOptimizer) {
    return creatingDevSsrOptimizer
  }
  creatingDevSsrOptimizer = (async function () {
    // Important: scanning needs to be done before starting the SSR dev optimizer
    // If ssrLoadModule is called before server.listen(), the main deps optimizer
    // will not be yet created
    const ssr = false
    if (!getDepsOptimizer(config, ssr)) {
      await initDepsOptimizer(config, server)
    }
    await getDepsOptimizer(config, ssr)!.scanProcessing

    await createDevSsrDepsOptimizer(config)
    creatingDevSsrOptimizer = undefined
  })()
  return await creatingDevSsrOptimizer
}

async function createDepsOptimizer(
  config: ResolvedConfig,
  server: ViteDevServer,
): Promise<void> {
  const { logger } = config // 配置对象
  const ssr = false
  const sessionTimestamp = Date.now().toString() // 时间戳

  // 加载缓存的优化元数据
  const cachedMetadata = await loadCachedDepOptimizationMetadata(config, ssr)

  let debounceProcessingHandle: NodeJS.Timeout | undefined

  let closed = false // 关闭标志

  // 依赖优化元数据，如果不存在缓存中的话，直接创建一个
  let metadata =
    cachedMetadata || initDepsOptimizerMetadata(config, ssr, sessionTimestamp)

  // 依赖优化选项：https://cn.vitejs.dev/config/dep-optimization-options
  const options = getDepOptimizationConfig(config, ssr)

  // noDiscovery：禁止自动发现依赖项
  // holdUntilCrawlEnd：被启用时，系统会在冷启动时保持第一个优化的依赖结果，直到所有的静态导入都被检索完毕
  const { noDiscovery, holdUntilCrawlEnd } = options

  const depsOptimizer: DepsOptimizer = {
    metadata,
    registerMissingImport,
    run: () => debouncedProcessing(0),
    /** 用于判断给定的模块ID是否指向一个优化过的依赖文件。 */
    isOptimizedDepFile: createIsOptimizedDepFile(config),
    /** 判断请求URL是否指向缓存目录中的文件的函数。 */
    isOptimizedDepUrl: createIsOptimizedDepUrl(config),
    getOptimizedDepId: (depInfo: OptimizedDepInfo) =>
      `${depInfo.file}?v=${depInfo.browserHash}`,
    close,
    options,
  }

  depsOptimizerMap.set(config, depsOptimizer) // 缓存一下

  let newDepsDiscovered = false // 新依赖发现标志

  let newDepsToLog: string[] = []
  let newDepsToLogHandle: NodeJS.Timeout | undefined
  const logNewlyDiscoveredDeps = () => {
    if (newDepsToLog.length) {
      config.logger.info(
        colors.green(
          `✨ new dependencies optimized: ${depsLogString(newDepsToLog)}`, // 新的依赖项优化
        ),
        {
          timestamp: true,
        },
      )
      newDepsToLog = []
    }
  }

  let discoveredDepsWhileScanning: string[] = []
  const logDiscoveredDepsWhileScanning = () => {
    if (discoveredDepsWhileScanning.length) {
      config.logger.info(
        colors.green(
          // 扫描时发现
          `✨ discovered while scanning: ${depsLogString(
            discoveredDepsWhileScanning,
          )}`,
        ),
        {
          timestamp: true,
        },
      )
      discoveredDepsWhileScanning = []
    }
  }

  // 依赖优化正在处理的 Promise
  let depOptimizationProcessing = promiseWithResolvers<void>()
  // 依赖优化正在处理的队列
  let depOptimizationProcessingQueue: PromiseWithResolvers<void>[] = []
  // 解决 依赖优化正在处理 的队列
  const resolveEnqueuedProcessingPromises = () => {
    // Resolve all the processings (including the ones which were delayed) 解决所有处理（包括延迟的处理）
    for (const processing of depOptimizationProcessingQueue) {
      processing.resolve() // 标志处理完成
    }
    depOptimizationProcessingQueue = [] // 清空队列
  }

  let enqueuedRerun: (() => void) | undefined
  let currentlyProcessing = false

  let firstRunCalled = !!cachedMetadata
  let warnAboutMissedDependencies = false

  // If this is a cold run, we wait for static imports discovered 如果这是冷运行，我们等待发现静态导入
  // from the first request before resolving to minimize full page reloads. 在解析之前从第一个请求开始，以尽量减少整页重新加载。
  // On warm start or after the first optimization is run, we use a simpler 在热启动或第一次优化运行后，我们使用更简单的
  // debounce strategy each time a new dep is discovered. 每次发现新的 dep 时的反跳策略。
  let waitingForCrawlEnd = false
  // 不存在缓存时, 才需要在解析之前处理依赖构建的问题
  if (!cachedMetadata) {
    server._onCrawlEnd(onCrawlEnd)
    waitingForCrawlEnd = true
  }

  // 运行构建优化依赖项的结果值
  let optimizationResult:
    | {
        cancel: () => Promise<void>
        result: Promise<DepOptimizationResult>
      }
    | undefined

  let discover:
    | {
        cancel: () => Promise<void>
        result: Promise<Record<string, string>>
      }
    | undefined

  async function close() {
    closed = true
    await Promise.allSettled([
      discover?.cancel(),
      depsOptimizer.scanProcessing,
      optimizationResult?.cancel(),
    ])
  }

  if (!cachedMetadata) {
    // Enter processing state until crawl of static imports ends 进入处理状态，直到静态导入的抓取结束
    currentlyProcessing = true

    // Initialize discovered deps with manually added optimizeDeps.include info 使用手动添加的 optimDeps.include 信息初始化发现的 deps

    const manuallyIncludedDeps: Record<string, string> = {} // 手动预构建依赖列表
    await addManuallyIncludedOptimizeDeps(manuallyIncludedDeps, config, ssr) // 向依赖列表中手动添加需要优化的依赖项。

    // 手动预构建依赖列表转化为 依赖相关信息，例如
    // {
    //  eslint: {
    //    id: "eslint", 依赖id
    //    file: "D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps/eslint.js", 构建后存储的路径
    //    src: "D:/学习/wzb_knowledge_base/源码学习/vite/node_modules/.pnpm/eslint@8.57.0/node_modules/eslint/lib/api.js", 依赖路径
    //    browserHash: "6362e130", 浏览器哈希值
    //    exportsData: { ... }, 依赖文件导出相关数据
    //  }
    // }
    const manuallyIncludedDepsInfo = toDiscoveredDependencies(
      config,
      manuallyIncludedDeps,
      ssr,
      sessionTimestamp,
    )

    // 遍历手动预构建依赖列表信息, 添加到 优化元数据(metadata) 的 discovered 属性中
    for (const depInfo of Object.values(manuallyIncludedDepsInfo)) {
      addOptimizedDepInfo(metadata, 'discovered', {
        ...depInfo,
        processing: depOptimizationProcessing.promise,
      })
      newDepsDiscovered = true
    }

    // 如果 禁止自动发现依赖项 的话, 那么直接启动第一次优化
    if (noDiscovery) {
      // We don't need to scan for dependencies or wait for the static crawl to end 我们不需要扫描依赖关系或等待静态爬行结束
      // Run the first optimization run immediately 立即运行第一次优化
      runOptimizer()
    } else {
      // Important, the scanner is dev only 重要的是，扫描仪仅供开发人员使用
      depsOptimizer.scanProcessing = new Promise((resolve) => {
        // Runs in the background in case blocking high priority tasks 在后台运行以防阻塞高优先级任务
        ;(async () => {
          try {
            debug?.(colors.green(`scanning for dependencies...`)) // 扫描依赖关系...

            // 依赖预构建：扫描入口文件，返回操作对象：取消扫描操作、Promise<依赖信息>
            discover = discoverProjectDependencies(config)
            // {
            //   execa: "D:/低代码/project/wzb/源码学习/vite/node_modules/.pnpm/execa@9.1.0/node_modules/execa/index.js",
            //   vue: "D:/低代码/project/wzb/源码学习/vite/node_modules/.pnpm/vue@3.4.27_typescript@5.2.2/node_modules/vue/dist/vue.runtime.esm-bundler.js",
            // }
            const deps = await discover.result
            discover = undefined

            // 手动预构建依赖列表
            const manuallyIncluded = Object.keys(manuallyIncludedDepsInfo)
            discoveredDepsWhileScanning.push(
              ...Object.keys(metadata.discovered).filter(
                (dep) => !deps[dep] && !manuallyIncluded.includes(dep),
              ),
            )

            // Add these dependencies to the discovered list, as these are currently 将这些依赖项添加到发现的列表中，因为这些是当前的
            // used by the preAliasPlugin to support aliased and optimized deps. 由 preAliasPlugin 使用来支持别名和优化的 deps。
            // This is also used by the CJS externalization heuristics in legacy mode 这也被遗留模式下的 CJS 外部化启发法使用
            for (const id of Object.keys(deps)) {
              if (!metadata.discovered[id]) {
                addMissingDep(id, deps[id])
              }
            }
            // 到这里，手动预构建依赖列表和扫描到的依赖都集成到了 metadata.discovered 数据中
            // {
            //   eslint: OptimizedDepInfo,
            //   execa: OptimizedDepInfo,
            //   vue: OptimizedDepInfo,
            // }

            // 创建一个包含所有已知依赖信息的对象
            const knownDeps = prepareKnownDeps()
            startNextDiscoveredBatch()

            // For dev, we run the scanner and the first optimization 对于开发，我们运行扫描器和第一次优化
            // run on the background 后台运行
            // 运行构建优化依赖项：返回一个对象 --> 包含一个取消函数和一个结果Promise，该Promise解析为依赖项优化结果。
            optimizationResult = runOptimizeDeps(config, knownDeps, ssr)

            // If the holdUntilCrawlEnd stratey is used, we wait until crawling has 如果使用 holdUntilCrawlEnd 策略，我们会等到爬行完成
            // ended to decide if we send this result to the browser or we need to 最终决定是否将结果发送到浏览器或者我们需要
            // do another optimize step 进行另一个优化步骤
            if (!holdUntilCrawlEnd) {
              // If not, we release the result to the browser as soon as the scanner 如果没有，我们会在扫描仪扫描完成后立即将结果发布到浏览器
              // is done. If the scanner missed any dependency, and a new dependency 已经完成了。如果扫描仪遗漏了任何依赖项，以及新的依赖项
              // is discovered while crawling static imports, then there will be a 在爬取静态导入时发现，那么就会有一个
              // full-page reload if new common chunks are generated between the old 如果旧的公共块之间生成了新的公共块，则重新加载整页
              // and new optimized deps. 和新的优化 deps。
              optimizationResult.result.then((result) => {
                // Check if the crawling of static imports has already finished. In that 检查静态导入的抓取是否已经完成。在那里面
                // case, the result is handled by the onCrawlEnd callback 这种情况，结果由 onCrawlEnd 回调处理
                if (!waitingForCrawlEnd) return

                optimizationResult = undefined // signal that we'll be using the result 表明我们将使用结果

                runOptimizer(result)
              })
            }
          } catch (e) {
            logger.error(e.stack || e.message)
          } finally {
            resolve()
            depsOptimizer.scanProcessing = undefined
          }
        })()
      })
    }
  }

  /**
   * 开始处理下一个发现的批次。
   * 此函数不接受参数，也不直接返回任何内容。
   * 它主要用于调度和准备处理下一个批次的依赖优化。
   */
  function startNextDiscoveredBatch() {
    newDepsDiscovered = false // 重置新发现依赖的标志

    // Add the current depOptimizationProcessing to the queue, these 将当前的depOptimizationProcessing添加到队列中，这些
    // promises are going to be resolved once a rerun is committed 一旦提交重新运行，承诺就会得到解决
    depOptimizationProcessingQueue.push(depOptimizationProcessing)

    // Create a new promise for the next rerun, discovered missing 为下一次重新运行创建一个新的 Promise，发现丢失了
    // dependencies will be assigned this promise from this point 从此时起，依赖项将被分配此承诺
    depOptimizationProcessing = promiseWithResolvers()
  }

  /**
   * 准备已知依赖信息
   * 该函数创建一个包含所有已知依赖信息的对象，这些信息来自优化和发现的元数据。
   * 其中，优化的依赖信息会被深拷贝，而发现的依赖信息会保留，但排除处理中的Promise。
   *
   * @returns {Record<string, OptimizedDepInfo>} knownDeps - 包含已知依赖信息的记录对象，键为依赖名称，值为对应的优化依赖信息对象。
   */
  function prepareKnownDeps() {
    const knownDeps: Record<string, OptimizedDepInfo> = {}
    // Clone optimized info objects, fileHash, browserHash may be changed for them 克隆优化的信息对象，fileHash、browserHash 可能会更改
    for (const dep of Object.keys(metadata.optimized)) {
      knownDeps[dep] = { ...metadata.optimized[dep] }
    }
    for (const dep of Object.keys(metadata.discovered)) {
      // Clone the discovered info discarding its processing promise 克隆发现的信息，放弃其处理承诺
      const { processing, ...info } = metadata.discovered[dep]
      knownDeps[dep] = info
    }
    return knownDeps
  }

  async function runOptimizer(preRunResult?: DepOptimizationResult) {
    // a successful completion of the optimizeDeps rerun will end up  成功完成优化Deps的重新运行将结束
    // creating new bundled version of all current and discovered deps 创建所有当前和已发现dep的新捆绑版本
    // in the cache dir and a new metadata info object assigned 在缓存目录中，并分配了一个新的元数据信息对象
    // to _metadata. A fullReload is only issued if the previous bundled 到 _metadata。只有在先前绑定的
    // dependencies have changed. 依赖关系已更改。

    // if the rerun fails, _metadata remains untouched, current discovered 如果重新运行失败，则元数据保持不变，当前已发现
    // deps are cleaned, and a fullReload is issued dep被清理，并发出fullReload

    // All deps, previous known and newly discovered are rebundled, 所有先前已知和新发现的dep都被重新处理，
    // respect insertion order to keep the metadata file stable 尊重插入顺序以保持元数据文件的稳定

    // 检查是否为首次运行
    const isRerun = firstRunCalled
    firstRunCalled = true

    // Ensure that rerun is called sequentially 确保按顺序调用重新运行
    enqueuedRerun = undefined // 重置重新运行的标志

    // Ensure that a rerun will not be issued for current discovered deps 确保不会对当前发现的 dep 发出重新运行
    if (debounceProcessingHandle) clearTimeout(debounceProcessingHandle) // 取消任何正在进行的防抖处理

    // 如果已关闭，则结束处理
    if (closed) {
      currentlyProcessing = false
      return
    }

    currentlyProcessing = true

    try {
      let processingResult: DepOptimizationResult
      // 使用先前的结果或重新优化
      if (preRunResult) {
        processingResult = preRunResult
      } else {
        const knownDeps = prepareKnownDeps()
        startNextDiscoveredBatch()

        optimizationResult = runOptimizeDeps(config, knownDeps, ssr)
        processingResult = await optimizationResult.result
        optimizationResult = undefined
      }

      // 如果已关闭，则取消当前处理并解决所有等待的处理承诺
      if (closed) {
        currentlyProcessing = false
        processingResult.cancel()
        resolveEnqueuedProcessingPromises() // 解决 依赖优化正在处理 的队列
        return
      }

      const newData = processingResult.metadata
      // 查找发现的依赖项与优化后的依赖项之间的互操作性不匹配。
      const needsInteropMismatch = findInteropMismatches(
        metadata.discovered,
        newData.optimized,
      )

      // After a re-optimization, if the internal bundled chunks change a full page reload 在重新优化后，如果内部捆绑块更改了整个页面的重新加载
      // is required. If the files are stable, we can avoid the reload that is expensive 是必需的。如果文件是稳定的，我们可以避免昂贵的重新加载
      // for large applications. Comparing their fileHash we can find out if it is safe to 用于大型应用程序。比较他们的fileHash，我们可以发现它是否安全
      // keep the current browser state. 保持当前浏览器状态。
      const needsReload =
        needsInteropMismatch.length > 0 ||
        metadata.hash !== newData.hash ||
        Object.keys(metadata.optimized).some((dep) => {
          return (
            metadata.optimized[dep].fileHash !== newData.optimized[dep].fileHash
          )
        })

      // 提交处理的依赖优化进程
      // 1. 调用 processingResult.commit 提交依赖构建结果, 生成一份依赖元数据并且将临时缓存目录更改成缓存目录
      // 2. 更新依赖元数据
      // 3. 解决 depOptimizationProcessing 队列，这样的话，依赖才能执行响应
      const commitProcessing = async () => {
        await processingResult.commit() // 提交依赖构建结果, 生成一份依赖元数据并且将临时缓存目录更改成缓存目录

        // While optimizeDeps is running, new missing deps may be discovered, 当optimizeDeps正在运行时，可能会发现新的缺失dep，
        // in which case they will keep being added to metadata.discovered 在这种情况下，它们将继续添加到元数据中。发现
        for (const id in metadata.discovered) {
          if (!newData.optimized[id]) {
            addOptimizedDepInfo(newData, 'discovered', metadata.discovered[id])
          }
        }

        // If we don't reload the page, we need to keep browserHash stable 如果我们不重新加载页面，我们需要保持browserHash的稳定
        // 更新 browserHash
        if (!needsReload) {
          newData.browserHash = metadata.browserHash // browserHash 赋值
          for (const dep in newData.chunks) {
            newData.chunks[dep].browserHash = metadata.browserHash
          }
          for (const dep in newData.optimized) {
            newData.optimized[dep].browserHash = (
              metadata.optimized[dep] || metadata.discovered[dep]
            ).browserHash
          }
        }

        // Commit hash and needsInterop changes to the discovered deps info 提交哈希和需求对发现的deps信息进行交互更改
        // object. Allow for code to await for the discovered processing promise 对象允许代码等待发现的处理承诺
        // and use the information in the same object 并使用同一对象中的信息
        for (const o in newData.optimized) {
          const discovered = metadata.discovered[o]
          if (discovered) {
            const optimized = newData.optimized[o]
            discovered.browserHash = optimized.browserHash
            discovered.fileHash = optimized.fileHash
            discovered.needsInterop = optimized.needsInterop
            discovered.processing = undefined
          }
        }

        if (isRerun) {
          newDepsToLog.push(
            ...Object.keys(newData.optimized).filter(
              (dep) => !metadata.optimized[dep],
            ),
          )
        }

        metadata = depsOptimizer.metadata = newData
        resolveEnqueuedProcessingPromises() // 解决 依赖优化正在处理 的队列
      }

      if (!needsReload) {
        // 不需要重载

        // 处理依赖优化进程
        await commitProcessing()

        if (!debug) {
          if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle)
          newDepsToLogHandle = setTimeout(() => {
            // 如果 200ms 之后, 发现了新的依赖项, 那么就会触发 logger
            newDepsToLogHandle = undefined
            logNewlyDiscoveredDeps()
            if (warnAboutMissedDependencies) {
              logDiscoveredDepsWhileScanning()
              config.logger.info(
                colors.magenta(
                  `❗ add these dependencies to optimizeDeps.include to speed up cold start`, // 将这些依赖项添加到optimizeDeps.include以加速冷启动
                ),
                { timestamp: true },
              )
              warnAboutMissedDependencies = false
            }
          }, 2 * debounceMs)
        } else {
          debug(
            colors.green(
              `✨ ${
                !isRerun
                  ? `dependencies optimized`
                  : `optimized dependencies unchanged`
              }`,
            ),
          )
        }
      } else {
        if (newDepsDiscovered) {
          // There are newly discovered deps, and another rerun is about to be
          // executed. Avoid the current full reload discarding this rerun result
          // We don't resolve the processing promise, as they will be resolved
          // once a rerun is committed
          processingResult.cancel()

          debug?.(
            colors.green(
              `✨ delaying reload as new dependencies have been found...`,
            ),
          )
        } else {
          await commitProcessing()

          if (!debug) {
            if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle)
            newDepsToLogHandle = undefined
            logNewlyDiscoveredDeps()
            if (warnAboutMissedDependencies) {
              logDiscoveredDepsWhileScanning()
              config.logger.info(
                colors.magenta(
                  `❗ add these dependencies to optimizeDeps.include to avoid a full page reload during cold start`,
                ),
                { timestamp: true },
              )
              warnAboutMissedDependencies = false
            }
          }

          logger.info(
            colors.green(`✨ optimized dependencies changed. reloading`),
            {
              timestamp: true,
            },
          )
          if (needsInteropMismatch.length > 0) {
            config.logger.warn(
              `Mixed ESM and CJS detected in ${colors.yellow(
                needsInteropMismatch.join(', '),
              )}, add ${
                needsInteropMismatch.length === 1 ? 'it' : 'them'
              } to optimizeDeps.needsInterop to speed up cold start`,
              {
                timestamp: true,
              },
            )
          }

          fullReload()
        }
      }
    } catch (e) {
      logger.error(
        colors.red(`error while updating dependencies:\n${e.stack}`),
        { timestamp: true, error: e },
      )
      resolveEnqueuedProcessingPromises()

      // Reset missing deps, let the server rediscover the dependencies
      metadata.discovered = {}
    }

    currentlyProcessing = false
    // @ts-expect-error `enqueuedRerun` could exist because `debouncedProcessing` may run while awaited
    enqueuedRerun?.()
  }

  function fullReload() {
    // Cached transform results have stale imports (resolved to
    // old locations) so they need to be invalidated before the page is
    // reloaded.
    server.moduleGraph.invalidateAll()

    server.hot.send({
      type: 'full-reload',
      path: '*',
    })
  }

  async function rerun() {
    // debounce time to wait for new missing deps finished, issue a new
    // optimization of deps (both old and newly found) once the previous
    // optimizeDeps processing is finished
    const deps = Object.keys(metadata.discovered)
    const depsString = depsLogString(deps)
    debug?.(colors.green(`new dependencies found: ${depsString}`))
    runOptimizer()
  }

  function getDiscoveredBrowserHash(
    hash: string,
    deps: Record<string, string>,
    missing: Record<string, string>,
  ) {
    return getHash(
      hash + JSON.stringify(deps) + JSON.stringify(missing) + sessionTimestamp,
    )
  }

  function registerMissingImport(
    id: string,
    resolved: string,
  ): OptimizedDepInfo {
    const optimized = metadata.optimized[id]
    if (optimized) {
      return optimized
    }
    const chunk = metadata.chunks[id]
    if (chunk) {
      return chunk
    }
    let missing = metadata.discovered[id]
    if (missing) {
      // We are already discover this dependency
      // It will be processed in the next rerun call
      return missing
    }

    missing = addMissingDep(id, resolved)

    // Until the first optimize run is called, avoid triggering processing
    // We'll wait until the user codebase is eagerly processed by Vite so
    // we can get a list of every missing dependency before giving to the
    // browser a dependency that may be outdated, thus avoiding full page reloads

    if (!waitingForCrawlEnd) {
      // Debounced rerun, let other missing dependencies be discovered before
      // the running next optimizeDeps
      debouncedProcessing()
    }

    // Return the path for the optimized bundle, this path is known before
    // esbuild is run to generate the pre-bundle
    return missing
  }

  // 向依赖优化元数据添加缺少的依赖
  function addMissingDep(id: string, resolved: string) {
    newDepsDiscovered = true

    // 向给定的依赖优化元数据中添加优化的依赖信息。
    return addOptimizedDepInfo(metadata, 'discovered', {
      id,
      file: getOptimizedDepPath(id, config, ssr),
      src: resolved,
      // Adding a browserHash to this missing dependency that is unique to 将 browserHash 添加到这个缺失的依赖项中，该依赖项是唯一的
      // the current state of known + missing deps. If its optimizeDeps run 已知 + 缺失 deps 的当前状态。如果它的optimizeDeps运行
      // doesn't alter the bundled files of previous known dependencies, 不会改变先前已知依赖项的捆绑文件，
      // we don't need a full reload and this browserHash will be kept 我们不需要完全重新加载，这个 browserHash 将被保留
      browserHash: getDiscoveredBrowserHash(
        metadata.hash,
        depsFromOptimizedDepInfo(metadata.optimized),
        depsFromOptimizedDepInfo(metadata.discovered),
      ),
      // loading of this pre-bundled dep needs to await for its processing 加载这个预捆绑的 dep 需要等待其处理
      // promise to be resolved 承诺解决
      processing: depOptimizationProcessing.promise,
      exportsData: extractExportsData(resolved, config, ssr),
    })
  }

  function debouncedProcessing(timeout = debounceMs) {
    // Debounced rerun, let other missing dependencies be discovered before
    // the next optimizeDeps run
    enqueuedRerun = undefined
    if (debounceProcessingHandle) clearTimeout(debounceProcessingHandle)
    if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle)
    newDepsToLogHandle = undefined
    debounceProcessingHandle = setTimeout(() => {
      debounceProcessingHandle = undefined
      enqueuedRerun = rerun
      if (!currentlyProcessing) {
        enqueuedRerun()
      }
    }, timeout)
  }

  // onCrawlEnd is called once when the server starts and all static onCrawlEnd 在服务器启动时调用一次并且全部静态
  // imports after the first request have been crawled (dynamic imports may also 在抓取第一个请求后导入（动态导入也可以
  // be crawled if the browser requests them right away). 如果浏览器立即请求它们，则将被抓取）。
  // 总之, 饶了一圈后, 最终执行这个方法来处理一些依赖优化的处理
  async function onCrawlEnd() {
    // switch after this point to a simple debounce strategy 在此之后切换到简单的去抖策略
    waitingForCrawlEnd = false // 表明爬取结束后的等待期已过，可以切换到简单的去抖策略

    debug?.(colors.green(`✨ static imports crawl ended`)) // 静态导入抓取结束
    // 如果实例已被关闭，则直接返回
    if (closed) {
      return
    }

    // Await for the scan+optimize step running in the background 等待后台运行的扫描+优化步骤
    // It normally should be over by the time crawling of user code ended 通常应该在用户代码爬取结束时结束
    // 等待后台的扫描和优化过程完成
    await depsOptimizer.scanProcessing

    // 判断是否应该使用扫描后的优化结果
    if (optimizationResult && !config.optimizeDeps.noDiscovery) {
      // In the holdUntilCrawlEnd strategy, we don't release the result of the 在 holdUntilDrawlEnd 策略中，我们不会发布
      // post-scanner optimize step to the browser until we reach this point 扫描后优化步骤到浏览器，直到我们达到这一点
      // If there are new dependencies, we do another optimize run, if not, we 如果有新的依赖项，我们会进行另一次优化运行，如果没有，我们
      // use the post-scanner optimize result 使用扫描后优化结果
      // If holdUntilCrawlEnd is false and we reach here, it means that the 如果 holdUntilDrawlEnd 为 false，并且我们到达这里，则意味着
      // scan+optimize step finished after crawl end. We follow the same 扫描+优化步骤在爬网结束后完成。我们遵循相同的
      // process as in the holdUntilCrawlEnd in this case. 在这种情况下，处理与 holdUntilDrawlEnd 中相同。
      const afterScanResult = optimizationResult.result
      optimizationResult = undefined // signal that we'll be using the result 表明我们将使用结果

      // 等待依赖构建完成后, 才继续执行
      const result = await afterScanResult
      currentlyProcessing = false

      // 分别获取爬取到的依赖和扫描到的依赖列表
      const crawlDeps = Object.keys(metadata.discovered) // 每个新发现的依赖项
      const scanDeps = Object.keys(result.metadata.optimized) // 已优化依赖项

      // 如果既没有扫描到依赖也没有爬取到依赖，则提交当前结果并结束
      if (scanDeps.length === 0 && crawlDeps.length === 0) {
        debug?.(
          colors.green(
            `✨ no dependencies found by the scanner or crawling static imports`, // 扫描仪或爬网静态导入未发现任何依赖项
          ),
        )
        // We still commit the result so the scanner isn't run on the next cold start 我们仍然提交结果，以便扫描仪在下一次冷启动时不会运行
        // for projects without dependencies 对于没有依赖项的项目
        startNextDiscoveredBatch()
        runOptimizer(result)
        return
      }

      // 检查扫描结果和爬取结果之间是否存在互操作性不匹配或扫描遗漏
      const needsInteropMismatch = findInteropMismatches(
        metadata.discovered,
        result.metadata.optimized,
      )
      const scannerMissedDeps = crawlDeps.some((dep) => !scanDeps.includes(dep))
      const outdatedResult =
        needsInteropMismatch.length > 0 || scannerMissedDeps

      // 如果结果过时，则取消当前结果，重新优化
      if (outdatedResult) {
        // Drop this scan result, and perform a new optimization to avoid a full reload 删除此扫描结果，并执行新的优化以避免完全重新加载
        result.cancel()

        // Add deps found by the scanner to the discovered deps while crawling 将扫描器发现的 deps 添加到爬行时发现的 deps 中
        for (const dep of scanDeps) {
          if (!crawlDeps.includes(dep)) {
            addMissingDep(dep, result.metadata.optimized[dep].src!)
          }
        }
        if (scannerMissedDeps) {
          debug?.(
            colors.yellow(
              `✨ new dependencies were found while crawling that weren't detected by the scanner`, // 爬网时发现了扫描仪未检测到的新依赖项
            ),
          )
        }
        debug?.(colors.green(`✨ re-running optimizer`)) // 重新运行优化器
        debouncedProcessing(0)
      } else {
        debug?.(
          colors.green(
            `✨ using post-scan optimizer result, the scanner found every used dependency`, // 使用扫描后优化器结果，扫描器找到每个使用的依赖项
          ),
        )
        startNextDiscoveredBatch()
        runOptimizer(result)
      }
    } else if (!holdUntilCrawlEnd) {
      // The post-scanner optimize result has been released to the browser
      // If new deps have been discovered, issue a regular rerun of the
      // optimizer. A full page reload may still be avoided if the new
      // optimize result is compatible in this case
      if (newDepsDiscovered) {
        debug?.(
          colors.green(
            // 在爬行静态进口，重新运行优化器时发现了新的依赖项
            `✨ new dependencies were found while crawling static imports, re-running optimizer`,
          ),
        )
        warnAboutMissedDependencies = true
        debouncedProcessing(0)
      }
    } else {
      const crawlDeps = Object.keys(metadata.discovered)
      currentlyProcessing = false

      if (crawlDeps.length === 0) {
        debug?.(
          colors.green(
            `✨ no dependencies found while crawling the static imports`, // 爬行静态导入时未找到依赖项
          ),
        )
        firstRunCalled = true
      }

      // queue the first optimizer run, even without deps so the result is cached 即使没有依赖项，也会对第一个优化器运行进行排队，以便缓存结果
      debouncedProcessing(0)
    }
  }
}

async function createDevSsrDepsOptimizer(
  config: ResolvedConfig,
): Promise<void> {
  const metadata = await optimizeServerSsrDeps(config)

  const depsOptimizer = {
    metadata,
    isOptimizedDepFile: createIsOptimizedDepFile(config),
    isOptimizedDepUrl: createIsOptimizedDepUrl(config),
    getOptimizedDepId: (depInfo: OptimizedDepInfo) =>
      `${depInfo.file}?v=${depInfo.browserHash}`,

    registerMissingImport: () => {
      throw new Error(
        'Vite Internal Error: registerMissingImport is not supported in dev SSR',
      )
    },
    // noop, there is no scanning during dev SSR
    // the optimizer blocks the server start
    run: () => {},

    close: async () => {},
    options: config.ssr.optimizeDeps,
  }
  devSsrDepsOptimizerMap.set(config, depsOptimizer)
}

/**
 * 查找发现的依赖项与优化后的依赖项之间的互操作性不匹配。
 *
 * 此函数用于比较“discovered”对象和“optimized”对象中依赖项的互操作性需求。
 * 如果依赖项在两个对象中的互操作性要求不同，则表明存在可能的配置不匹配，需要关注。
 *
 * @param discovered 一个对象，包含关于发现的依赖项及其互操作性需求的信息。
 * @param optimized 一个对象，包含关于优化后的依赖项及其互操作性需求的信息。
 * @returns 返回具有互操作性不匹配的依赖项数组。
 */
function findInteropMismatches(
  discovered: Record<string, OptimizedDepInfo>,
  optimized: Record<string, OptimizedDepInfo>,
) {
  const needsInteropMismatch = [] // 初始化一个数组以存储具有互操作性不匹配的依赖项名称。
  for (const dep in discovered) {
    const discoveredDepInfo = discovered[dep]
    const depInfo = optimized[dep]
    // 如果依赖项存在于优化后的对象中，则比较互操作性要求。
    if (depInfo) {
      // 如果在两个对象中都明确设置了互操作性要求且它们不同，
      // 则表示存在需要添加到结果数组中的不匹配情况。
      if (
        discoveredDepInfo.needsInterop !== undefined &&
        depInfo.needsInterop !== discoveredDepInfo.needsInterop
      ) {
        // This only happens when a discovered dependency has mixed ESM and CJS syntax 仅当发现的依赖项具有混合 ESM 和 CJS 语法时才会发生这种情况
        // and it hasn't been manually added to optimizeDeps.needsInterop 并且它还没有被手动添加到optimizeDeps.needsInterop中
        needsInteropMismatch.push(dep)
        debug?.(colors.cyan(`✨ needsInterop mismatch detected for ${dep}`)) // 检测到 needInterop 不匹配
      }
    }
  }
  // 返回具有互操作性不匹配的依赖项数组。
  return needsInteropMismatch
}

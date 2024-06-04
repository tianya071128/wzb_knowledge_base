import fsp from 'node:fs/promises'
import colors from 'picocolors'
import type { ResolvedConfig } from '..'
import type { Plugin } from '../plugin'
import { DEP_VERSION_RE } from '../constants'
import { createDebugger } from '../utils'
import { getDepsOptimizer, optimizedDepInfoFromFile } from '../optimizer'
import { cleanUrl } from '../../shared/utils'

export const ERR_OPTIMIZE_DEPS_PROCESSING_ERROR =
  'ERR_OPTIMIZE_DEPS_PROCESSING_ERROR'
export const ERR_OUTDATED_OPTIMIZED_DEP = 'ERR_OUTDATED_OPTIMIZED_DEP'
export const ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR =
  'ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR'

const debug = createDebugger('vite:optimize-deps')

// 插件处理依赖的加载, 会在 load 钩子中，等待依赖优化的完成，之后直接读取对应的 依赖文件。
// 例如：D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps/vue.js 直接读取这个文件
export function optimizedDepsPlugin(config: ResolvedConfig): Plugin {
  return {
    name: 'vite:optimized-deps',

    // 自定义解析器 -- https://cn.rollupjs.org/plugin-development/#resolveid
    resolveId(id, source, { ssr }) {
      if (getDepsOptimizer(config, ssr)?.isOptimizedDepFile(id)) {
        // 符合条件时， 返回原始 id
        return id
      }
    },

    // this.load({ id }) isn't implemented in PluginContainer this.load（｛id｝）未在PluginContainer中实现
    // The logic to register an id to wait until it is processed 注册id以等待处理的逻辑
    // is in importAnalysis, see call to delayDepsOptimizerUntil 在importAnalysis中，请参阅对delayDepsOptimizerUntil的调用

    // 自定义加载器 -- https://cn.rollupjs.org/plugin-development/#load
    // 对于依赖的请求，会在这里处理
    // 1. 根据 config 配置对象获取依赖优化信息
    // 2. 从依赖优化元数据中提取特定文件的优化依赖信息
    // 3. 等待优化依赖处理完成之后, 就可以直接加载依赖的目录
    async load(id, options) {
      // id："D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps/vue.js?v=d9566fb3"

      const ssr = options?.ssr === true
      const depsOptimizer = getDepsOptimizer(config, ssr)
      // 检测指定 id 是否为依赖优化文件
      if (depsOptimizer?.isOptimizedDepFile(id)) {
        const metadata = depsOptimizer.metadata // 依赖元数据
        const file = cleanUrl(id) // 文件路径: D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps/vue.js
        const versionMatch = id.match(DEP_VERSION_RE) // 请求版本匹配信息
        // 浏览器hash, 一般附在路径后面 v=xxx --> d9566fb3
        const browserHash = versionMatch
          ? versionMatch[1].split('=')[1]
          : undefined

        // Search in both the currently optimized and newly discovered deps 在当前优化的和新发现的 deps 中搜索
        // 从依赖优化元数据中提取特定文件的优化依赖信息。
        const info = optimizedDepInfoFromFile(metadata, file)
        if (info) {
          // 如果请求的 hash 与依赖优化信息的 hash 不一致的话，说明有一个新版本的依赖
          if (browserHash && info.browserHash !== browserHash) {
            throwOutdatedRequest(id) // 此时，抛出错误，会被中间件捕获并通知浏览器刷新重新请求
          }
          try {
            // This is an entry point, it may still not be bundled 这是一个入口点，可能还没有被捆绑
            await info.processing
          } catch {
            // If the refresh has not happened after timeout, Vite considers 如果超时后仍未发生刷新，则Vite认为
            // something unexpected has happened. In this case, Vite 发生了一些意想不到的事情。在这种情况下，Vite
            // returns an empty response that will error. 返回一个会出错的空响应
            throwProcessingError(id)
          }

          // 检测文件是否新鲜 -- 依赖可能过时, 会重新构建依赖
          const newMetadata = depsOptimizer.metadata
          if (metadata !== newMetadata) {
            const currentInfo = optimizedDepInfoFromFile(newMetadata!, file)
            if (info.browserHash !== currentInfo?.browserHash) {
              throwOutdatedRequest(id) // 此时，抛出错误，会被中间件捕获并通知浏览器刷新重新请求
            }
          }
        }
        debug?.(`load ${colors.cyan(file)}`)
        // Load the file from the cache instead of waiting for other plugin 从缓存加载文件，而不是等待其他插件
        // load hooks to avoid race conditions, once processing is resolved, 一旦解决了处理，
        // we are sure that the file has been properly save to disk 我们确信该文件已正确保存到磁盘
        try {
          return await fsp.readFile(file, 'utf-8')
        } catch (e) {
          const newMetadata = depsOptimizer.metadata
          if (optimizedDepInfoFromFile(newMetadata, file)) {
            // Outdated non-entry points (CHUNK), loaded after a rerun
            throwOutdatedRequest(id) // 此时，抛出错误，会被中间件捕获并通知浏览器刷新重新请求
          }
          throwFileNotFoundInOptimizedDep(id)
        }
      }
    },
  }
}

// 抛出 加载依赖 请求错误
function throwProcessingError(id: string): never {
  const err: any = new Error(
    `Something unexpected happened while optimizing "${id}". ` + // 优化“${id}”时发生了意外情况。
      `The current page should have reloaded by now`, // 当前页面现在应该已经重新加载
  )
  err.code = ERR_OPTIMIZE_DEPS_PROCESSING_ERROR
  // This error will be caught by the transform middleware that will 此错误将被转换中间件捕获，该中间件将
  // send a 504 status code request timeout 发送504状态码请求超时
  throw err
}

// 抛出 过时依赖 请求错误
export function throwOutdatedRequest(id: string): never {
  const err: any = new Error(
    `There is a new version of the pre-bundle for "${id}", ` + // ${id}”有一个新版本的预捆绑包，
      `a page reload is going to ask for it.`, // 页面重新加载将要求它。
  )
  err.code = ERR_OUTDATED_OPTIMIZED_DEP
  // This error will be caught by the transform middleware that will 此错误将被转换中间件捕获，该中间件将
  // send a 504 status code request timeout 发送504状态码请求超时
  throw err
}

export function throwFileNotFoundInOptimizedDep(id: string): never {
  const err: any = new Error(
    `The file does not exist at "${id}" which is in the optimize deps directory. ` + // 优化deps目录中的“$｛id｝”中不存在该文件。
      `The dependency might be incompatible with the dep optimizer. ` + // 依赖项可能与dep优化器不兼容。
      `Try adding it to \`optimizeDeps.exclude\`.`, // 请尝试将其添加到“optimizeDeps.exclude”中
  )
  err.code = ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR
  // This error will be caught by the transform middleware that will 此错误将被转换中间件捕获，该中间件将
  // send a 404 status code not found 发送未找到的404状态代码
  throw err
}

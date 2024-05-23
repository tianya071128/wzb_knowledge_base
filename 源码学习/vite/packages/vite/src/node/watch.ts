import { EventEmitter } from 'node:events'
import path from 'node:path'
import glob from 'fast-glob'
import type { FSWatcher, WatchOptions } from 'dep-types/chokidar'
import type { OutputOptions } from 'rollup'
import * as colors from 'picocolors'
import { withTrailingSlash } from '../shared/utils'
import { arraify, normalizePath } from './utils'
import type { ResolvedConfig } from './config'
import type { Logger } from './logger'

/**
 * 获取解析后的输出目录集合。
 *
 * @param root 根目录路径。
 * @param outDir 输出目录相对路径。
 * @param outputOptions rollup 输出配置，可以是数组或者单个配置对象，未定义时默认返回解析后的单个输出目录。
 * @returns 返回一个字符串集，包含所有解析后的输出目录路径。
 */
export function getResolvedOutDirs(
  root: string,
  outDir: string,
  /** rollup 相关配置 */
  outputOptions: OutputOptions[] | OutputOptions | undefined,
): Set<string> {
  const resolvedOutDir = path.resolve(root, outDir) // 构建输出目录
  if (!outputOptions) return new Set([resolvedOutDir])

  return new Set(
    arraify(outputOptions).map(({ dir }) =>
      dir ? path.resolve(root, dir) : resolvedOutDir,
    ),
  )
}

/**
 * 根据给定条件决定是否清空输出目录。
 *
 * @param emptyOutDir - 如果为true，则无条件清空输出目录；如果为false，则不进行清空；如果为null，则根据其他条件决定。
 * @param root - 项目根目录的路径。
 * @param outDirs - 需要检查的输出目录集合。
 * @param logger - 可选的日志记录器，用于记录警告信息。
 * @returns 返回一个布尔值，指示是否应该清空输出目录。
 */
export function resolveEmptyOutDir(
  emptyOutDir: boolean | null,
  root: string,
  outDirs: Set<string>,
  logger?: Logger,
): boolean {
  if (emptyOutDir != null) return emptyOutDir

  for (const outDir of outDirs) {
    if (!normalizePath(outDir).startsWith(withTrailingSlash(root))) {
      // warn if outDir is outside of root 如果 outDir 位于 root 之外，则发出警告
      logger?.warn(
        colors.yellow(
          `\n${colors.bold(`(!)`)} outDir ${colors.white(
            colors.dim(outDir),
          )} is not inside project root and will not be emptied.\n` + // 不在项目根目录内，不会被清空
            `Use --emptyOutDir to override.\n`, // 使用 --emptyOutDir 覆盖
        ),
      )
      return false
    }
  }
  return true
}

/**
 * 根据给定的配置和选项解析Chokidar监视器的选项。
 *
 * @param config 已解析的配置对象，包含缓存目录等配置信息。
 * @param options 可选的Chokidar监视器配置对象，用于定制忽略的路径等。
 * @param resolvedOutDirs 已解析的输出目录集合，如果为空目录，这些目录将被添加到忽略列表。
 * @param emptyOutDir 表示输出目录是否为空的布尔值，如果为空，输出目录将被添加到忽略列表。
 * @returns 返回一个解析后的Chokidar监视器配置对象。
 */
export function resolveChokidarOptions(
  config: ResolvedConfig,
  options: WatchOptions | undefined,
  resolvedOutDirs: Set<string>,
  emptyOutDir: boolean,
): WatchOptions {
  const { ignored: ignoredList, ...otherOptions } = options ?? {}
  // 初始化忽略列表，包含默认忽略的路径和用户自定义的忽略路径
  const ignored: WatchOptions['ignored'] = [
    '**/.git/**',
    '**/node_modules/**',
    '**/test-results/**', // Playwright
    glob.escapePath(config.cacheDir) + '/**',
    ...arraify(ignoredList || []),
  ]
  // 如果输出目录为空，将已解析的输出目录添加到忽略列表中
  if (emptyOutDir) {
    ignored.push(
      ...[...resolvedOutDirs].map((outDir) => glob.escapePath(outDir) + '/**'),
    )
  }

  // 结合所有配置项生成最终的Chokidar监视器配置
  const resolvedWatchOptions: WatchOptions = {
    ignored,
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  }

  return resolvedWatchOptions
}

class NoopWatcher extends EventEmitter implements FSWatcher {
  constructor(public options: WatchOptions) {
    super()
  }

  add() {
    return this
  }

  unwatch() {
    return this
  }

  getWatched() {
    return {}
  }

  ref() {
    return this
  }

  unref() {
    return this
  }

  async close() {
    // noop
  }
}

// 创建空的监听文件器
export function createNoopWatcher(options: WatchOptions): FSWatcher {
  return new NoopWatcher(options)
}

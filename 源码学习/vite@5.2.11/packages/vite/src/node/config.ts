import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { performance } from 'node:perf_hooks'
import { createRequire } from 'node:module'
import colors from 'picocolors'
import type { Alias, AliasOptions } from 'dep-types/alias'
import aliasPlugin from '@rollup/plugin-alias'
import { build } from 'esbuild'
import type { RollupOptions } from 'rollup'
import { withTrailingSlash } from '../shared/utils'
import {
  CLIENT_ENTRY,
  DEFAULT_ASSETS_RE,
  DEFAULT_CONFIG_FILES,
  DEFAULT_EXTENSIONS,
  DEFAULT_MAIN_FIELDS,
  ENV_ENTRY,
  FS_PREFIX,
} from './constants'
import type { HookHandler, Plugin, PluginWithRequiredHook } from './plugin'
import type {
  BuildOptions,
  RenderBuiltAssetUrl,
  ResolvedBuildOptions,
} from './build'
import { resolveBuildOptions } from './build'
import type { ResolvedServerOptions, ServerOptions } from './server'
import { resolveServerOptions } from './server'
import type { PreviewOptions, ResolvedPreviewOptions } from './preview'
import { resolvePreviewOptions } from './preview'
import {
  type CSSOptions,
  type ResolvedCSSOptions,
  resolveCSSOptions,
} from './plugins/css'
import {
  asyncFlatten,
  createDebugger,
  createFilter,
  isBuiltin,
  isExternalUrl,
  isFilePathESM,
  isNodeBuiltin,
  isObject,
  isParentDirectory,
  mergeAlias,
  mergeConfig,
  normalizeAlias,
  normalizePath,
} from './utils'
import { getFsUtils } from './fsUtils'
import {
  createPluginHookUtils,
  getHookHandler,
  getSortedPluginsByHook,
  resolvePlugins,
} from './plugins'
import type { ESBuildOptions } from './plugins/esbuild'
import type { InternalResolveOptions, ResolveOptions } from './plugins/resolve'
import { resolvePlugin, tryNodeResolve } from './plugins/resolve'
import type { LogLevel, Logger } from './logger'
import { createLogger } from './logger'
import type { DepOptimizationConfig, DepOptimizationOptions } from './optimizer'
import type { JsonOptions } from './plugins/json'
import type { PluginContainer } from './server/pluginContainer'
import { createPluginContainer } from './server/pluginContainer'
import type { PackageCache } from './packages'
import { findNearestPackageData } from './packages'
import { loadEnv, resolveEnvPrefix } from './env'
import type { ResolvedSSROptions, SSROptions } from './ssr'
import { resolveSSROptions } from './ssr'

const debug = createDebugger('vite:config')
const promisifiedRealpath = promisify(fs.realpath)

export interface ConfigEnv {
  /**
   * 'serve': during dev (`vite` command) 在dev期间（“vite”命令）
   * 'build': when building for production (`vite build` command) 为生产构建时（“vite-build”命令）
   */
  command: 'build' | 'serve'
  mode: string
  isSsrBuild?: boolean
  isPreview?: boolean
}

/**
 * spa: include SPA fallback middleware and configure sirv with `single: true` in preview
 *
 * mpa: only include non-SPA HTML middlewares
 *
 * custom: don't include HTML middlewares
 */
export type AppType = 'spa' | 'mpa' | 'custom'

export type UserConfigFnObject = (env: ConfigEnv) => UserConfig
export type UserConfigFnPromise = (env: ConfigEnv) => Promise<UserConfig>
export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>

export type UserConfigExport =
  | UserConfig
  | Promise<UserConfig>
  | UserConfigFnObject
  | UserConfigFnPromise
  | UserConfigFn

/**
 * Type helper to make it easier to use vite.config.ts
 * accepts a direct {@link UserConfig} object, or a function that returns it.
 * The function receives a {@link ConfigEnv} object.
 */
export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfigFnObject): UserConfigFnObject
export function defineConfig(config: UserConfigExport): UserConfigExport
export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config
}

export type PluginOption =
  | Plugin
  | false
  | null
  | undefined
  | PluginOption[]
  | Promise<Plugin | false | null | undefined | PluginOption[]>

export interface UserConfig {
  /**
   * Project root directory. Can be an absolute path, or a path relative from 项目根目录。可以是绝对路径，也可以是来自
   * the location of the config file itself. 配置文件本身的位置
   * @default process.cwd()
   */
  root?: string
  /**
   * Base public path when served in development or production. 开发或生产服务时的基本公共路径
   * @default '/'
   */
  base?: string
  /**
   * Directory to serve as plain static assets. Files in this directory are 目录作为普通静态资产。此目录中的文件为
   * served and copied to build dist dir as-is without transform. The value 提供并复制以按原样构建dist-dir，而无需转换。价值
   * can be either an absolute file system path or a path relative to project root. 可以是绝对文件系统路径，也可以是相对于项目根的路径。
   *
   * Set to `false` or an empty string to disable copied static assets to build dist dir. 设置为“false”或空字符串可禁用复制的静态资产以构建dist-dir。
   * @default 'public'
   */
  publicDir?: string | false
  /**
   * Directory to save cache files. Files in this directory are pre-bundled 保存缓存文件的目录。此目录中的文件已预绑定
   * deps or some other cache files that generated by vite, which can improve deps 或其他一些由vite生成的缓存文件，可以改进
   * the performance. You can use `--force` flag or manually delete the directory 表演。您可以使用“--force”标志或手动删除目录
   * to regenerate the cache files. The value can be either an absolute file 以重新生成缓存文件。该值可以是绝对文件
   * system path or a path relative to project root. 系统路径或相对于项目根的路径。
   * Default to `.vite` when no `package.json` is detected. 当未检测到“package.json”时，默认为“.wite”。
   * @default 'node_modules/.vite'
   */
  cacheDir?: string
  /**
   * Explicitly set a mode to run in. This will override the default mode for 显式设置运行模式。这将覆盖的默认模式
   * each command, and can be overridden by the command line --mode option. 每个命令，并且可以被命令行--mode选项覆盖
   */
  mode?: string
  /**
   * Define global variable replacements.
   * Entries will be defined on `window` during dev and replaced during build.
   */
  define?: Record<string, any>
  /**
   * Array of vite plugins to use.
   */
  plugins?: PluginOption[]
  /**
   * Configure resolver
   */
  resolve?: ResolveOptions & { alias?: AliasOptions }
  /**
   * HTML related options
   */
  html?: HTMLOptions
  /**
   * CSS related options (preprocessors and CSS modules)
   */
  css?: CSSOptions
  /**
   * JSON loading options
   */
  json?: JsonOptions
  /**
   * Transform options to pass to esbuild.
   * Or set to `false` to disable esbuild.
   */
  esbuild?: ESBuildOptions | false
  /**
   * Specify additional picomatch patterns to be treated as static assets.
   */
  assetsInclude?: string | RegExp | (string | RegExp)[]
  /**
   * Server specific options, e.g. host, port, https...
   */
  server?: ServerOptions
  /**
   * Build specific options
   */
  build?: BuildOptions
  /**
   * Preview specific options, e.g. host, port, https...
   */
  preview?: PreviewOptions
  /**
   * Dep optimization options
   */
  optimizeDeps?: DepOptimizationOptions
  /**
   * SSR specific options
   */
  ssr?: SSROptions
  /**
   * Experimental features
   *
   * Features under this field could change in the future and might NOT follow semver.
   * Please be careful and always pin Vite's version when using them.
   * @experimental
   */
  experimental?: ExperimentalOptions
  /**
   * Legacy options
   *
   * Features under this field only follow semver for patches, they could be removed in a
   * future minor version. Please always pin Vite's version to a minor when using them.
   */
  legacy?: LegacyOptions
  /**
   * Log level.
   * @default 'info'
   */
  logLevel?: LogLevel
  /**
   * Custom logger.
   */
  customLogger?: Logger
  /**
   * @default true
   */
  clearScreen?: boolean
  /**
   * Environment files directory. Can be an absolute path, or a path relative from
   * root.
   * @default root
   */
  envDir?: string
  /**
   * Env variables starts with `envPrefix` will be exposed to your client source code via import.meta.env.
   * @default 'VITE_'
   */
  envPrefix?: string | string[]
  /**
   * Worker bundle options
   */
  worker?: {
    /**
     * Output format for worker bundle
     * @default 'iife'
     */
    format?: 'es' | 'iife'
    /**
     * Vite plugins that apply to worker bundle. The plugins returned by this function
     * should be new instances every time it is called, because they are used for each
     * rollup worker bundling process.
     */
    plugins?: () => PluginOption[]
    /**
     * Rollup options to build worker bundle
     */
    rollupOptions?: Omit<
      RollupOptions,
      'plugins' | 'input' | 'onwarn' | 'preserveEntrySignatures'
    >
  }
  /**
   * Whether your application is a Single Page Application (SPA),
   * a Multi-Page Application (MPA), or Custom Application (SSR
   * and frameworks with custom HTML handling)
   * @default 'spa'
   */
  appType?: AppType
}

export interface HTMLOptions {
  /**
   * A nonce value placeholder that will be used when generating script/style tags.
   *
   * Make sure that this placeholder will be replaced with a unique value for each request by the server.
   */
  cspNonce?: string
}

export interface ExperimentalOptions {
  /**
   * Append fake `&lang.(ext)` when queries are specified, to preserve the file extension for following plugins to process.
   *
   * @experimental
   * @default false
   */
  importGlobRestoreExtension?: boolean
  /**
   * Allow finegrain control over assets and public files paths
   *
   * @experimental
   */
  renderBuiltUrl?: RenderBuiltAssetUrl
  /**
   * Enables support of HMR partial accept via `import.meta.hot.acceptExports`.
   *
   * @experimental
   * @default false
   */
  hmrPartialAccept?: boolean
  /**
   * Skips SSR transform to make it easier to use Vite with Node ESM loaders.
   * @warning Enabling this will break normal operation of Vite's SSR in development mode.
   *
   * @experimental
   * @default false
   */
  skipSsrTransform?: boolean
}

export interface LegacyOptions {
  /**
   * In Vite 4, SSR-externalized modules (modules not bundled and loaded by Node.js at runtime)
   * are implicitly proxied in dev to automatically handle `default` and `__esModule` access.
   * However, this does not correctly reflect how it works in the Node.js runtime, causing
   * inconsistencies between dev and prod.
   *
   * In Vite 5, the proxy is removed so dev and prod are consistent, but if you still require
   * the old behaviour, you can enable this option. If so, please leave your feedback at
   * https://github.com/vitejs/vite/discussions/14697.
   */
  proxySsrExternalModules?: boolean
}

export interface ResolvedWorkerOptions {
  format: 'es' | 'iife'
  plugins: (bundleChain: string[]) => Promise<Plugin[]>
  rollupOptions: RollupOptions
}

export interface InlineConfig extends UserConfig {
  /** 配置文件 */
  configFile?: string | false
  envFile?: false
}

export type ResolvedConfig = Readonly<
  Omit<
    UserConfig,
    'plugins' | 'css' | 'assetsInclude' | 'optimizeDeps' | 'worker' | 'build'
  > & {
    configFile: string | undefined
    configFileDependencies: string[]
    inlineConfig: InlineConfig
    root: string
    base: string
    /** @internal */
    rawBase: string
    publicDir: string
    cacheDir: string
    command: 'build' | 'serve'
    mode: string
    isWorker: boolean
    // in nested worker bundle to find the main config
    /** @internal */
    mainConfig: ResolvedConfig | null
    /** @internal list of bundle entry id. used to detect recursive worker bundle. */
    bundleChain: string[]
    isProduction: boolean
    envDir: string
    env: Record<string, any>
    resolve: Required<ResolveOptions> & {
      alias: Alias[]
    }
    plugins: readonly Plugin[]
    css: ResolvedCSSOptions
    esbuild: ESBuildOptions | false
    server: ResolvedServerOptions
    build: ResolvedBuildOptions
    preview: ResolvedPreviewOptions
    ssr: ResolvedSSROptions
    assetsInclude: (file: string) => boolean
    logger: Logger
    createResolver: (options?: Partial<InternalResolveOptions>) => ResolveFn
    optimizeDeps: DepOptimizationOptions
    /** @internal */
    packageCache: PackageCache
    worker: ResolvedWorkerOptions
    appType: AppType
    experimental: ExperimentalOptions
  } & PluginHookUtils
>

export interface PluginHookUtils {
  getSortedPlugins: <K extends keyof Plugin>(
    hookName: K,
  ) => PluginWithRequiredHook<K>[]
  getSortedPluginHooks: <K extends keyof Plugin>(
    hookName: K,
  ) => NonNullable<HookHandler<Plugin[K]>>[]
}

export type ResolveFn = (
  id: string,
  importer?: string,
  aliasOnly?: boolean,
  ssr?: boolean,
) => Promise<string | undefined>

/**
 * 检查根路径是否包含非法字符：# 和 ?
 * Check and warn if `path` includes characters that don't work well in Vite, 检查并警告“path”是否包含在 Vite 中无法正常工作的字符
 * such as `#` and `?`. 例如“#”和“?”
 */
function checkBadCharactersInPath(path: string, logger: Logger): void {
  const badChars = []

  if (path.includes('#')) {
    badChars.push('#')
  }
  if (path.includes('?')) {
    badChars.push('?')
  }

  if (badChars.length > 0) {
    const charString = badChars.map((c) => `"${c}"`).join(' and ')
    const inflectedChars = badChars.length > 1 ? 'characters' : 'character'

    logger.warn(
      colors.yellow(
        // 项目根目录包含 ... 运行 Vite 时可能不起作用。考虑重命名目录以删除字符
        `The project root contains the ${charString} ${inflectedChars} (${colors.cyan(
          path,
        )}), which may not work when running Vite. Consider renaming the directory to remove the characters.`,
      ),
    )
  }
}

/**
 * 解析配置项，得到一个配置对象
 * 1. 加载配置文件，得出配置信息
 * 2. 运行插件的 config 钩子，给插件提供修改配置项的时机
 * 3. 加载对应模式下的 .env 文件，并提取出能够暴露给客户端源码的环境变量
 * 4. 依次处理：处理 build 构建选项、处理服务器配置项、处理 SSR 选项、处理 Worker 选项
 * 5. 获取所有插件：包含用户定义的插件、内置插件
 * 6. 运行插件的 configResolved 钩子
 * 7. 得到一个最终配置对象 ResolvedConfig
 *
 * @param inlineConfig 一般为命令行配置项
 * @param command  命令
 * @param defaultMode  默认模式
 * @param defaultNodeEnv 默认 Node 模式
 * @param isPreview 是否为预览模式
 * @returns
 */
export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig> {
  let config = inlineConfig
  let configFileDependencies: string[] = []
  let mode = inlineConfig.mode || defaultMode // 模式，默认为 development
  const isNodeEnvSet = !!process.env.NODE_ENV
  const packageCache: PackageCache = new Map() // package 文件解析缓存对象

  // some dependencies e.g. @vue/compiler-* relies on NODE_ENV for getting 一些依赖项，例如@vue/compiler-*依赖NODE_ENV来获取
  // production-specific behavior, so set it early on 特定于生产的行为，所以尽早设置
  if (!isNodeEnvSet) {
    process.env.NODE_ENV = defaultNodeEnv // 设置 Node 环境下的 NODE_ENV 变量
  }

  const configEnv: ConfigEnv = {
    mode,
    command,
    isSsrBuild: command === 'build' && !!config.build?.ssr,
    isPreview,
  }

  let { configFile } = config
  if (configFile !== false) {
    /**
     * 加载配置文件, 返回值如下：
     *  path: "D:/低代码/project/wzb/源码学习/vite/playground/html/vite.config.js", // 配置文件路径
     *  dependencies: ["vite.config.js",], // 配置文件的依赖项
     *  config: 用户配置项
     */
    const loadResult = await loadConfigFromFile(
      configEnv,
      configFile,
      config.root,
      config.logLevel,
      config.customLogger,
    )
    if (loadResult) {
      config = mergeConfig(loadResult.config, config) // 合并配置项：将配置文件的配置项和命令行的配置项合并
      configFile = loadResult.path
      configFileDependencies = loadResult.dependencies
    }
  }

  // user config may provide an alternative mode. But --mode has a higher priority 用户配置可以提供替代模式。但 --mode 具有更高的优先级
  mode = inlineConfig.mode || config.mode || mode
  configEnv.mode = mode

  // 过滤插件 -- 通过 apply 属性根据场景过滤插件 https://cn.vitejs.dev/guide/api-plugin#conditional-application
  const filterPlugin = (p: Plugin) => {
    // Falsy 虚值插件, 剔除
    if (!p) {
      return false
    }
    // 没有 apply 属性的, 通过
    else if (!p.apply) {
      return true
    }
    // apply 属性为函数的, 调用函数决定是否通过
    else if (typeof p.apply === 'function') {
      return p.apply({ ...config, mode }, configEnv)
    }
    // apply 属性是其他, 则直接与当前命令比较
    else {
      return p.apply === command
    }
  }

  // resolve plugins 解析插件
  const rawUserPlugins = (
    (await asyncFlatten(config.plugins || [])) as Plugin[]
  ) // 将插件扁平化成 Plugin[]
    .filter(filterPlugin) // 过滤

  // 插件排序：[之前执行, 正常执行, 之后执行]
  const [prePlugins, normalPlugins, postPlugins] =
    sortUserPlugins(rawUserPlugins)

  // run config hooks 运行配置挂钩
  const userPlugins = [...prePlugins, ...normalPlugins, ...postPlugins]
  config = await runConfigHook(config, userPlugins, configEnv) // 运行 config 钩子

  // Define logger 定义记录器
  const logger = createLogger(config.logLevel, {
    allowClearScreen: config.clearScreen, // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息。https://cn.vitejs.dev/config/shared-options.html#clearscreen
    customLogger: config.customLogger, // 使用自定义 logger 记录消息：https://cn.vitejs.dev/config/shared-options.html#customlogger
  })

  // resolve root 解析根 -- 例如：D:/低代码/project/wzb/源码学习/vite/playground/html
  const resolvedRoot = normalizePath(
    config.root ? path.resolve(config.root) : process.cwd(), // 如果没有传入 root 的话, 那默认使用当前目录
  )

  checkBadCharactersInPath(resolvedRoot, logger) // 检查根路径是否包含非法字符：# 和 ?

  const clientAlias = [
    {
      find: /^\/?@vite\/env/,
      replacement: path.posix.join(FS_PREFIX, normalizePath(ENV_ENTRY)),
    },
    {
      find: /^\/?@vite\/client/,
      replacement: path.posix.join(FS_PREFIX, normalizePath(CLIENT_ENTRY)),
    },
  ]

  // resolve alias with internal client alias 使用内部客户端别名解析别名
  // 将 内置alias 和 用户定义alias 合并后规范为 [Alias] 格式
  const resolvedAlias = normalizeAlias(
    mergeAlias(clientAlias, config.resolve?.alias || []), // 先将 内置alias 和 用户定义alias 合并
  )

  // 加载相关配置项
  const resolveOptions: ResolvedConfig['resolve'] = {
    mainFields: config.resolve?.mainFields ?? DEFAULT_MAIN_FIELDS, // 在解析包的入口点时尝试的字段列表 -- https://cn.vitejs.dev/config/shared-options.html#resolve-mainfields
    conditions: config.resolve?.conditions ?? [], // https://cn.vitejs.dev/config/shared-options.html#resolve-conditions
    extensions: config.resolve?.extensions ?? DEFAULT_EXTENSIONS, // 导入时想要省略的扩展名列表。 -- https://cn.vitejs.dev/config/shared-options.html#resolve-extensions
    dedupe: config.resolve?.dedupe ?? [], // https://cn.vitejs.dev/config/shared-options.html#resolve-dedupe
    preserveSymlinks: config.resolve?.preserveSymlinks ?? false, // 启用此选项会使 Vite 通过原始文件路径（即不跟随符号链接的路径）而不是真正的文件路径（即跟随符号链接后的路径）确定文件身份。
    alias: resolvedAlias, // https://cn.vitejs.dev/config/shared-options.html#resolve-alias
  }

  if (
    // @ts-expect-error removed field 删除字段
    config.resolve?.browserField === false &&
    resolveOptions.mainFields.includes('browser')
  ) {
    logger.warn(
      colors.yellow(
        `\`resolve.browserField\` is set to false, but the option is removed in favour of ` + // `\`resolve.browserField\`设置为false，但删除了该选项以支持`
          `the 'browser' string in \`resolve.mainFields\`. You may want to update \`resolve.mainFields\` ` + // `“resolve.mainFields”中的“browser”字符串。您可能需要更新“resolve.mainFields”
          `to remove the 'browser' string and preserve the previous browser behaviour.`, // `删除“browser”字符串并保留以前的浏览器行为。'，
      ),
    )
  }

  // load .env files 加载 .env 文件
  const envDir = config.envDir // 用于加载 .env 文件的目录 -- https://cn.vitejs.dev/config/shared-options.html#envdir
    ? normalizePath(path.resolve(resolvedRoot, config.envDir))
    : resolvedRoot
  // 处理 .env 文件, 并且提取出暴露给客户端源码的变量
  // {
  //   VITE_FAVICON_URL: '/sprite.svg'
  //   VITE_FOO: 'bar'
  // }
  const userEnv =
    inlineConfig.envFile !== false && // envFile：设置为 false 时，则禁用 .env 文件。
    loadEnv(mode, envDir, resolveEnvPrefix(config))

  // Note it is possible for user to have a custom mode, e.g. `staging` where 请注意，用户可以有自定义模式，例如‘分期’在哪里
  // development-like behavior is expected. This is indicated by NODE_ENV=development 预期会有类似开发的行为。这由 NODE_ENV=development 表示
  // loaded from `.staging.env` and set by us as VITE_USER_NODE_ENV 从 `.staging.env` 加载并由我们设置为 VITE_USER_NODE_ENV
  const userNodeEnv = process.env.VITE_USER_NODE_ENV // 可能由用户在 .env 中设置 NODE_ENV 值, 此时就会在 ./env.ts 中设置在 process.env.VITE_USER_NODE_ENV
  if (!isNodeEnvSet && userNodeEnv) {
    if (userNodeEnv === 'development') {
      process.env.NODE_ENV = 'development'
    } else {
      // NODE_ENV=production is not supported as it could break HMR in dev for frameworks like Vue NODE_ENV=production 不受支持，因为它可能会破坏Vue等框架的开发中的HMR
      logger.warn(
        `NODE_ENV=${userNodeEnv} is not supported in the .env file. ` + // `在.ENV文件中不支持NODE_ENV=$｛userNodeEnv｝。`
          `Only NODE_ENV=development is supported to create a development build of your project. ` + // `只有NODE_ENV=development支持来创建项目的开发构建。`
          `If you need to set process.env.NODE_ENV, you can set it in the Vite config instead.`, // `如果需要设置process.env.NODE_ENV，您可以在Vite配置中进行设置`
      )
    }
  }

  const isProduction = process.env.NODE_ENV === 'production' // 用户环境是否为生产环境

  // resolve public base url  // 解析公共基础 url
  const isBuild = command === 'build' // 是否为 build 命令
  const relativeBaseShortcut = config.base === '' || config.base === './'

  // During dev, we ignore relative base and fallback to '/' 在开发过程中，我们忽略相对基数并回退到“/”
  // For the SSR build, relative base isn't possible by means 对于SSR的构建，相对基础是不可能的
  // of import.meta.url. import.meta.url的。
  const resolvedBase = relativeBaseShortcut
    ? !isBuild || config.build?.ssr
      ? '/'
      : './'
    : resolveBaseUrl(config.base, isBuild, logger) ?? '/'

  // 处理 build 构建选项 -- https://cn.vitejs.dev/config/build-options.html
  const resolvedBuildOptions = resolveBuildOptions(
    config.build,
    logger,
    resolvedRoot,
  )

  // resolve cache directory 解析缓存目录
  const pkgDir = findNearestPackageData(resolvedRoot, packageCache)?.dir // 找到 package.json 目录
  const cacheDir = normalizePath(
    config.cacheDir // 如果用户配置了的话, 采用用户配置的目录
      ? path.resolve(resolvedRoot, config.cacheDir)
      : pkgDir // 否则使用默认路径
        ? path.join(pkgDir, `node_modules/.vite`)
        : path.join(resolvedRoot, `.vite`),
  )

  // 静态资源过滤器
  const assetsFilter =
    config.assetsInclude &&
    (!Array.isArray(config.assetsInclude) || config.assetsInclude.length)
      ? createFilter(config.assetsInclude)
      : () => false

  // create an internal resolver to be used in special scenarios, e.g. 创建一个内部解析器以在特殊场景中使用，例如
  // optimizer & handling css @imports 优化器和处理 css @imports
  const createResolver: ResolvedConfig['createResolver'] = (options) => {
    let aliasContainer: PluginContainer | undefined
    let resolverContainer: PluginContainer | undefined
    return async (id, importer, aliasOnly, ssr) => {
      let container: PluginContainer
      if (aliasOnly) {
        container =
          aliasContainer ||
          (aliasContainer = await createPluginContainer({
            ...resolved,
            plugins: [aliasPlugin({ entries: resolved.resolve.alias })],
          }))
      } else {
        container =
          resolverContainer ||
          (resolverContainer = await createPluginContainer({
            ...resolved,
            plugins: [
              aliasPlugin({ entries: resolved.resolve.alias }),
              resolvePlugin({
                ...resolved.resolve,
                root: resolvedRoot,
                isProduction,
                isBuild: command === 'build',
                ssrConfig: resolved.ssr,
                asSrc: true,
                preferRelative: false,
                tryIndex: true,
                ...options,
                idOnly: true,
                fsUtils: getFsUtils(resolved),
              }),
            ],
          }))
      }
      return (
        await container.resolveId(id, importer, {
          ssr,
          scan: options?.scan,
        })
      )?.id
    }
  }

  const { publicDir } = config // 静态资源服务的文件夹
  // 规范静态资源服务的文件夹 -- D:/低代码/project/wzb/源码学习/vite/playground/html/public
  const resolvedPublicDir =
    publicDir !== false && publicDir !== ''
      ? normalizePath(
          path.resolve(
            resolvedRoot,
            typeof publicDir === 'string' ? publicDir : 'public',
          ),
        )
      : ''

  const server = resolveServerOptions(resolvedRoot, config.server, logger) // 处理服务器配置项 -- https://cn.vitejs.dev/config/server-options.html
  const ssr = resolveSSROptions(config.ssr, resolveOptions.preserveSymlinks) // 处理 SSR 选项 -- https://cn.vitejs.dev/config/ssr-options.html

  const optimizeDeps = config.optimizeDeps || {}

  const BASE_URL = resolvedBase // base Url：开发或生产环境服务的公共基础路径。

  let resolved: ResolvedConfig

  // 修正 worker.plugins 配置格式
  let createUserWorkerPlugins = config.worker?.plugins
  if (Array.isArray(createUserWorkerPlugins)) {
    // @ts-expect-error backward compatibility
    createUserWorkerPlugins = () => config.worker?.plugins

    logger.warn(
      colors.yellow(
        `worker.plugins is now a function that returns an array of plugins. ` + // worker.plugins 现在是一个返回插件数组的函数
          `Please update your Vite config accordingly.\n`, // 请相应更新您的 Vite 配置
      ),
    )
  }

  const createWorkerPlugins = async function (bundleChain: string[]) {
    // Some plugins that aren't intended to work in the bundling of workers (doing post-processing at build time for example).
    // And Plugins may also have cached that could be corrupted by being used in these extra rollup calls.
    // So we need to separate the worker plugin from the plugin that vite needs to run.
    const rawWorkerUserPlugins = (
      (await asyncFlatten(createUserWorkerPlugins?.() || [])) as Plugin[]
    ).filter(filterPlugin)

    // resolve worker
    let workerConfig = mergeConfig({}, config)
    const [workerPrePlugins, workerNormalPlugins, workerPostPlugins] =
      sortUserPlugins(rawWorkerUserPlugins)

    // run config hooks
    const workerUserPlugins = [
      ...workerPrePlugins,
      ...workerNormalPlugins,
      ...workerPostPlugins,
    ]
    workerConfig = await runConfigHook(
      workerConfig,
      workerUserPlugins,
      configEnv,
    )

    const workerResolved: ResolvedConfig = {
      ...workerConfig,
      ...resolved,
      isWorker: true,
      mainConfig: resolved,
      bundleChain,
    }
    const resolvedWorkerPlugins = await resolvePlugins(
      workerResolved,
      workerPrePlugins,
      workerNormalPlugins,
      workerPostPlugins,
    )

    // run configResolved hooks
    await Promise.all(
      createPluginHookUtils(resolvedWorkerPlugins)
        .getSortedPluginHooks('configResolved')
        .map((hook) => hook(workerResolved)),
    )

    return resolvedWorkerPlugins
  }

  // 处理 Worker 选项 -- https://cn.vitejs.dev/config/worker-options.html
  const resolvedWorkerOptions: ResolvedWorkerOptions = {
    format: config.worker?.format || 'iife',
    plugins: createWorkerPlugins,
    rollupOptions: config.worker?.rollupOptions || {},
  }

  // 组装成所有的配置项
  resolved = {
    configFile: configFile ? normalizePath(configFile) : undefined,
    configFileDependencies: configFileDependencies.map((name) =>
      normalizePath(path.resolve(name)),
    ),
    inlineConfig,
    root: resolvedRoot,
    base: withTrailingSlash(resolvedBase),
    rawBase: resolvedBase,
    resolve: resolveOptions,
    publicDir: resolvedPublicDir,
    cacheDir,
    command,
    mode,
    ssr,
    isWorker: false,
    mainConfig: null,
    bundleChain: [],
    isProduction,
    plugins: userPlugins,
    css: resolveCSSOptions(config.css),
    esbuild:
      config.esbuild === false
        ? false
        : {
            jsxDev: !isProduction,
            ...config.esbuild,
          },
    server,
    build: resolvedBuildOptions,
    preview: resolvePreviewOptions(config.preview, server),
    envDir,
    env: {
      ...userEnv,
      BASE_URL,
      MODE: mode,
      DEV: !isProduction,
      PROD: isProduction,
    },
    assetsInclude(file: string) {
      return DEFAULT_ASSETS_RE.test(file) || assetsFilter(file)
    },
    logger,
    packageCache,
    // 创建一个内部解析器以在特殊场景中使用
    createResolver,
    optimizeDeps: {
      holdUntilCrawlEnd: true,
      ...optimizeDeps,
      esbuildOptions: {
        preserveSymlinks: resolveOptions.preserveSymlinks,
        ...optimizeDeps.esbuildOptions,
      },
    },
    worker: resolvedWorkerOptions,
    appType: config.appType ?? 'spa',
    experimental: {
      importGlobRestoreExtension: false,
      hmrPartialAccept: false,
      ...config.experimental,
    },
    getSortedPlugins: undefined!,
    getSortedPluginHooks: undefined!,
  }
  resolved = {
    ...config,
    ...resolved,
  }
  // 获取所有插件：包含用户定义的插件、内置插件
  ;(resolved.plugins as Plugin[]) = await resolvePlugins(
    resolved,
    prePlugins,
    normalPlugins,
    postPlugins,
  )
  Object.assign(resolved, createPluginHookUtils(resolved.plugins))

  // call configResolved hooks 调用 configResolved 钩子 -- https://cn.vitejs.dev/guide/api-plugin.html#configresolved
  await Promise.all(
    resolved
      .getSortedPluginHooks('configResolved')
      .map((hook) => hook(resolved)),
  )

  optimizeDepsDisabledBackwardCompatibility(resolved, resolved.optimizeDeps)
  optimizeDepsDisabledBackwardCompatibility(
    resolved,
    resolved.ssr.optimizeDeps,
    'ssr.',
  )

  // 使用解析的配置
  debug?.(`using resolved config: %O`, {
    ...resolved,
    plugins: resolved.plugins.map((p) => p.name),
    worker: {
      ...resolved.worker,
      plugins: `() => plugins`,
    },
  })

  // validate config 验证配置

  if (
    config.build?.terserOptions &&
    config.build.minify &&
    config.build.minify !== 'terser'
  ) {
    logger.warn(
      colors.yellow(
        `build.terserOptions is specified but build.minify is not set to use Terser. ` + // 指定了 build.terserOptions 但未将 build.minify 设置为使用 Terser
          `Note Vite now defaults to use esbuild for minification. If you still ` + // 注意 Vite 现在默认使用 esbuild 进行缩小。如果你还
          `prefer Terser, set build.minify to "terser".`, // 更喜欢 Terser，将 build.minify 设置为“terser”。
      ),
    )
  }

  // Check if all assetFileNames have the same reference. 检查所有 assetFileName 是否具有相同的引用
  // If not, display a warn for user. 如果没有，则向用户显示警告
  const outputOption = config.build?.rollupOptions?.output ?? []
  // Use isArray to narrow its type to array 使用 isArray 将其类型缩小为数组
  if (Array.isArray(outputOption)) {
    const assetFileNamesList = outputOption.map(
      (output) => output.assetFileNames,
    )
    if (assetFileNamesList.length > 1) {
      const firstAssetFileNames = assetFileNamesList[0]
      const hasDifferentReference = assetFileNamesList.some(
        (assetFileNames) => assetFileNames !== firstAssetFileNames,
      )
      if (hasDifferentReference) {
        // assetFileNames 对于每个 build.rollupOptions.output 并不相等。 Vite 支持跨所有输出的单一模式
        resolved.logger.warn(
          colors.yellow(`
assetFileNames isn't equal for every build.rollupOptions.output. A single pattern across all outputs is supported by Vite.
`),
        )
      }
    }
  }

  // Warn about removal of experimental features 关于删除实验性功能的警告
  if (
    // @ts-expect-error Option removed
    config.legacy?.buildSsrCjsExternalHeuristics ||
    // @ts-expect-error Option removed
    config.ssr?.format === 'cjs'
  ) {
    resolved.logger.warn(
      colors.yellow(`
(!) Experimental legacy.buildSsrCjsExternalHeuristics and ssr.format were be removed in Vite 5. (!) 实验性的 Legacy.buildSsrCjsExternalHeuristics 和 ssr.format 在 Vite 5 中被删除。
    The only SSR Output format is ESM. Find more information at https://github.com/vitejs/vite/discussions/13816. 唯一的 SSR 输出格式是 ESM。欲了解更多信息，请访问 https://github.com/vitejs/vite/discussions/13816
`),
    )
  }

  // 整理输出路径
  const resolvedBuildOutDir = normalizePath(
    path.resolve(resolved.root, resolved.build.outDir),
  )
  if (
    isParentDirectory(resolvedBuildOutDir, resolved.root) ||
    resolvedBuildOutDir === resolved.root
  ) {
    // build.outDir 不能与 root 相同的目录或 root 的父目录，因为这可能会导致 Vite 用构建输出覆盖源文件
    resolved.logger.warn(
      colors.yellow(`
(!) build.outDir must not be the same directory of root or a parent directory of root as this could cause Vite to overwriting source files with build outputs.
`),
    )
  }

  return resolved
}

/**
 * 加载 base Url，在这里会确保是绝对路径
 * Resolve base url. Note that some users use Vite to build for non-web targets like 解析基本 url。请注意，一些用户使用 Vite 来构建非 Web 目标，例如
 * electron or expects to deploy 电子或预计部署
 */
export function resolveBaseUrl(
  base: UserConfig['base'] = '/',
  /** 是否为 build 命令 */
  isBuild: boolean,
  /** 打印器 */
  logger: Logger,
): string {
  // 如果是以 '.' 开头, 那么断定为 '/', 并发出警告
  if (base[0] === '.') {
    logger.warn(
      colors.yellow(
        colors.bold(
          `(!) invalid "base" option: "${base}". The value can only be an absolute ` + // (!) 无效的“base”选项：“${base}”。该值只能是绝对值
            `URL, "./", or an empty string.`, // URL、“./”或空字符串。
        ),
      ),
    )
    return '/'
  }

  // external URL flag 外部 URL 标志
  const isExternal = isExternalUrl(base) // 检查是否为 http(https) url
  // no leading slash warn // 没有前导斜杠警告
  if (!isExternal && base[0] !== '/') {
    logger.warn(
      colors.yellow(
        colors.bold(`(!) "base" option should start with a slash.`), // (!)“base”选项应以斜杠开头。
      ),
    )
  }

  // parse base when command is serve or base is not External URL 当命令为服务或基址不是外部 URL 时解析基址
  if (!isBuild || !isExternal) {
    base = new URL(base, 'http://vitejs.dev').pathname
    // ensure leading slash 确保前导斜杠
    if (base[0] !== '/') {
      base = '/' + base
    }
  }

  return base
}

// 插件排序：[之前执行, 正常执行, 之后执行]
export function sortUserPlugins(
  plugins: (Plugin | Plugin[])[] | undefined,
): [Plugin[], Plugin[], Plugin[]] {
  const prePlugins: Plugin[] = [] // 之前执行的插件
  const postPlugins: Plugin[] = [] // 之后执行的插件
  const normalPlugins: Plugin[] = [] // 正常执行的插件

  if (plugins) {
    plugins.flat().forEach((p) => {
      if (p.enforce === 'pre') prePlugins.push(p)
      else if (p.enforce === 'post') postPlugins.push(p)
      else normalPlugins.push(p)
    })
  }

  return [prePlugins, normalPlugins, postPlugins]
}

/**
 * 加载配置文件, 返回值如下：
 *  path: "D:/低代码/project/wzb/源码学习/vite/playground/html/vite.config.js", // 配置文件路径
 *  dependencies: ["vite.config.js",], // 配置文件的依赖项
 *  config: 用户配置项
 */
export async function loadConfigFromFile(
  /** 环境信息 */
  configEnv: ConfigEnv,
  /** 配置文件路径 */
  configFile?: string,
  /** 根目录 */
  configRoot: string = process.cwd(),
  /** 日志等级：https://cn.vitejs.dev/guide/cli.html#options */
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null> {
  const start = performance.now() // 开始时间戳
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`

  let resolvedPath: string | undefined // 配置文件路径

  // 找到配置文件路径：如果传入了的话，那么直接读取传入值。否则就从可能得配置文件加上根目录读取
  if (configFile) {
    // explicit config path is always resolved from cwd 显式配置路径始终从cwd解析
    resolvedPath = path.resolve(configFile)
  } else {
    // implicit config file loaded from inline root (if present) 从内联根加载的隐式配置文件（如果存在）
    // otherwise from cwd 否则来自cwd
    for (const filename of DEFAULT_CONFIG_FILES) {
      const filePath = path.resolve(configRoot, filename)
      if (!fs.existsSync(filePath)) continue

      resolvedPath = filePath
      break
    }
  }

  // 找不到配置文件，直接返回
  if (!resolvedPath) {
    debug?.('no config file found.') // 找不到配置文件
    return null
  }

  const isESM = isFilePathESM(resolvedPath) // 是否为 ESM 文件

  try {
    const bundled = await bundleConfigFile(resolvedPath, isESM) // 构建后的配置文件信息
    // 提取出用户的配置文件的配置信息
    const userConfig = await loadConfigFromBundledFile(
      resolvedPath,
      bundled.code,
      isESM,
    )
    debug?.(`bundled config file loaded in ${getTime()}`) // 捆绑的配置文件加载

    const config = await (typeof userConfig === 'function'
      ? userConfig(configEnv) // 如果是函数的话, 那么执行对应函数
      : userConfig)
    if (!isObject(config)) {
      throw new Error(`config must export or return an object.`) // 配置必须导出或返回一个对象
    }
    return {
      path: normalizePath(resolvedPath),
      config,
      dependencies: bundled.dependencies,
    }
  } catch (e) {
    createLogger(logLevel, { customLogger }).error(
      colors.red(`failed to load config from ${resolvedPath}`),
      {
        error: e,
      },
    )
    throw e
  }
}

// 使用 esbuild 构建配置文件，返回构建后的配置文件
async function bundleConfigFile(
  fileName: string,
  isESM: boolean,
): Promise<{ code: string; dependencies: string[] }> {
  const dirnameVarName = '__vite_injected_original_dirname'
  const filenameVarName = '__vite_injected_original_filename'
  const importMetaUrlVarName = '__vite_injected_original_import_meta_url'
  // 使用 esbuild 构建配置文件
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    write: false, // 构建API调用可以直接写入文件系统，也可以返回将写入内存缓冲区的文件。
    target: ['node18'],
    platform: 'node',
    bundle: true, // 捆绑文件意味着将任何导入的依赖项都嵌入到文件本身中。
    format: isESM ? 'esm' : 'cjs', // 生成的JavaScript文件设置了输出格式
    mainFields: ['main'],
    sourcemap: 'inline',
    metafile: true, // 此选项告诉Esbuild以JSON格式生产一些有关构建的元数据。
    define: {
      __dirname: dirnameVarName,
      __filename: filenameVarName,
      'import.meta.url': importMetaUrlVarName,
      'import.meta.dirname': dirnameVarName,
      'import.meta.filename': filenameVarName,
    },
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          const packageCache = new Map()
          const resolveByViteResolver = (
            id: string,
            importer: string,
            isRequire: boolean,
          ) => {
            return tryNodeResolve(
              id,
              importer,
              {
                root: path.dirname(fileName),
                isBuild: true,
                isProduction: true,
                preferRelative: false,
                tryIndex: true,
                mainFields: [],
                conditions: [],
                overrideConditions: ['node'],
                dedupe: [],
                extensions: DEFAULT_EXTENSIONS,
                preserveSymlinks: false,
                packageCache,
                isRequire,
              },
              false,
            )?.id
          }

          // externalize bare imports
          build.onResolve(
            { filter: /^[^.].*/ },
            async ({ path: id, importer, kind }) => {
              if (
                kind === 'entry-point' ||
                path.isAbsolute(id) ||
                isNodeBuiltin(id)
              ) {
                return
              }

              // With the `isNodeBuiltin` check above, this check captures if the builtin is a
              // non-node built-in, which esbuild doesn't know how to handle. In that case, we
              // externalize it so the non-node runtime handles it instead.
              if (isBuiltin(id)) {
                return { external: true }
              }

              const isImport = isESM || kind === 'dynamic-import'
              let idFsPath: string | undefined
              try {
                idFsPath = resolveByViteResolver(id, importer, !isImport)
              } catch (e) {
                if (!isImport) {
                  let canResolveWithImport = false
                  try {
                    canResolveWithImport = !!resolveByViteResolver(
                      id,
                      importer,
                      false,
                    )
                  } catch {}
                  if (canResolveWithImport) {
                    throw new Error(
                      `Failed to resolve ${JSON.stringify(
                        id,
                      )}. This package is ESM only but it was tried to load by \`require\`. See https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.`,
                    )
                  }
                }
                throw e
              }
              if (idFsPath && isImport) {
                idFsPath = pathToFileURL(idFsPath).href
              }
              if (
                idFsPath &&
                !isImport &&
                isFilePathESM(idFsPath, packageCache)
              ) {
                throw new Error(
                  `${JSON.stringify(
                    id,
                  )} resolved to an ESM file. ESM file cannot be loaded by \`require\`. See https://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.`,
                )
              }
              return {
                path: idFsPath,
                external: true,
              }
            },
          )
        },
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await fsp.readFile(args.path, 'utf-8')
            const injectValues =
              `const ${dirnameVarName} = ${JSON.stringify(
                path.dirname(args.path),
              )};` +
              `const ${filenameVarName} = ${JSON.stringify(args.path)};` +
              `const ${importMetaUrlVarName} = ${JSON.stringify(
                pathToFileURL(args.path).href,
              )};`

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents,
            }
          })
        },
      },
    ],
  })
  const { text } = result.outputFiles[0]
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  }
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any
}

/**
 * 根据配置文件构建后的代码，提取出 vite.config.xx 配置文件的配置信息
 *
 *  1. 对于 ESM：先将其写入到根目录下，在通过 import() 提取出来，然后将文件删除
 *  2. 对于 CJM: 略
 */
const _require = createRequire(import.meta.url)
async function loadConfigFromBundledFile(
  fileName: string, // 配置文件路径
  bundledCode: string, // 配置文件构建后的代码
  isESM: boolean, // 是否为 ESM 文件
): Promise<UserConfigExport> {
  // for esm, before we can register loaders without requiring users to run node 对于esm，在我们可以注册加载程序而不需要用户运行节点之前
  // with --experimental-loader themselves, we have to do a hack here: 使用实验加载程序本身，我们必须在这里进行破解：
  // write it to disk, load it with native Node ESM, then delete the file. 将其写入磁盘，用本机Node ESM加载，然后删除该文件。
  if (isESM) {
    const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}` // "D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\html\\vite.config.js.timestamp-1716261321745-2f958d7ba289c"
    const fileNameTmp = `${fileBase}.mjs` // "D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\html\\vite.config.js.timestamp-1716261321745-2f958d7ba289c.mjs"
    const fileUrl = `${pathToFileURL(fileBase)}.mjs` // file:///D:/%E4%BD%8E%E4%BB%A3%E7%A0%81/project/wzb/%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/vite/playground/html/vite.config.js.timestamp-1716261321745-2f958d7ba289c.mjs
    await fsp.writeFile(fileNameTmp, bundledCode) // 写入文件
    try {
      return (await import(fileUrl)).default
    } finally {
      // 删除文件
      fs.unlink(fileNameTmp, () => {}) // Ignore errors 忽略错误
    }
  }
  // for cjs, we can register a custom loader via `_require.extensions` 对于cjs，我们可以通过`_require.extensions注册一个自定义加载程序`
  else {
    const extension = path.extname(fileName)
    // We don't use fsp.realpath() here because it has the same behaviour as
    // fs.realpath.native. On some Windows systems, it returns uppercase volume
    // letters (e.g. "C:\") while the Node.js loader uses lowercase volume letters.
    // See https://github.com/vitejs/vite/issues/12923
    const realFileName = await promisifiedRealpath(fileName)
    const loaderExt = extension in _require.extensions ? extension : '.js'
    const defaultLoader = _require.extensions[loaderExt]!
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
      } else {
        defaultLoader(module, filename)
      }
    }
    // clear cache in case of server restart
    delete _require.cache[_require.resolve(fileName)]
    const raw = _require(fileName)
    _require.extensions[loaderExt] = defaultLoader
    return raw.__esModule ? raw.default : raw
  }
}

// 执行插件的 config 钩子
async function runConfigHook(
  config: InlineConfig,
  plugins: Plugin[],
  configEnv: ConfigEnv,
): Promise<InlineConfig> {
  let conf = config

  // getSortedPluginsByHook('config', plugins) 获取 config 钩子：https://cn.vitejs.dev/guide/api-plugin#config
  for (const p of getSortedPluginsByHook('config', plugins)) {
    const hook = p.config // 插件的 config 钩子
    const handler = getHookHandler(hook) // 提取出钩子的处理器
    if (handler) {
      const res = await handler(conf, configEnv) // 执行钩子
      if (res) {
        conf = mergeConfig(conf, res) // 合并配置项
      }
    }
  }

  return conf
}

// 根据提供的配置和SSR状态，获取依赖优化的配置。
export function getDepOptimizationConfig(
  config: ResolvedConfig,
  ssr: boolean,
): DepOptimizationConfig {
  return ssr ? config.ssr.optimizeDeps : config.optimizeDeps
}
// 检测是否启动预构建优化
export function isDepsOptimizerEnabled(
  config: ResolvedConfig,
  ssr: boolean,
): boolean {
  const optimizeDeps = getDepOptimizationConfig(config, ssr)
  // optimizeDeps.noDiscovery：禁止自动发现依赖项
  // optimizeDeps.include：强制预构建链接的包
  // 当这两项都满足的话, 那么表示不需要依赖预构建
  return !(optimizeDeps.noDiscovery && !optimizeDeps.include?.length)
}

function optimizeDepsDisabledBackwardCompatibility(
  resolved: ResolvedConfig,
  optimizeDeps: DepOptimizationConfig,
  optimizeDepsPath: string = '',
) {
  const optimizeDepsDisabled = optimizeDeps.disabled
  if (optimizeDepsDisabled !== undefined) {
    if (optimizeDepsDisabled === true || optimizeDepsDisabled === 'dev') {
      const commonjsOptionsInclude = resolved.build?.commonjsOptions?.include
      const commonjsPluginDisabled =
        Array.isArray(commonjsOptionsInclude) &&
        commonjsOptionsInclude.length === 0
      optimizeDeps.noDiscovery = true
      optimizeDeps.include = undefined
      if (commonjsPluginDisabled) {
        resolved.build.commonjsOptions.include = undefined
      }
      resolved.logger.warn(
        colors.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.
    To disable the deps optimizer, set ${optimizeDepsPath}optimizeDeps.noDiscovery to true and ${optimizeDepsPath}optimizeDeps.include as undefined or empty.
    Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.
    ${
      commonjsPluginDisabled
        ? 'Empty config.build.commonjsOptions.include will be ignored to support CJS during build. This config should also be removed.'
        : ''
    }
  `),
      )
    } else if (
      optimizeDepsDisabled === false ||
      optimizeDepsDisabled === 'build'
    ) {
      resolved.logger.warn(
        colors.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.
    Setting it to ${optimizeDepsDisabled} now has no effect.
    Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.
  `),
      )
    }
  }
}

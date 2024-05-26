import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import glob from 'fast-glob'
import type {
  BuildContext,
  Loader,
  OnLoadArgs,
  OnLoadResult,
  Plugin,
} from 'esbuild'
import esbuild, { formatMessages, transform } from 'esbuild'
import colors from 'picocolors'
import type { ResolvedConfig } from '..'
import {
  CSS_LANGS_RE,
  JS_TYPES_RE,
  KNOWN_ASSET_TYPES,
  SPECIAL_QUERY_RE,
} from '../constants'
import {
  arraify,
  createDebugger,
  dataUrlRE,
  externalRE,
  isInNodeModules,
  isObject,
  isOptimizable,
  moduleListContains,
  multilineCommentsRE,
  normalizePath,
  singlelineCommentsRE,
  virtualModulePrefix,
  virtualModuleRE,
} from '../utils'
import type { PluginContainer } from '../server/pluginContainer'
import { createPluginContainer } from '../server/pluginContainer'
import { transformGlobImport } from '../plugins/importMetaGlob'
import { cleanUrl } from '../../shared/utils'
import { loadTsconfigJsonForFile } from '../plugins/esbuild'

type ResolveIdOptions = Parameters<PluginContainer['resolveId']>[2]

const debug = createDebugger('vite:deps')

const htmlTypesRE = /\.(html|vue|svelte|astro|imba)$/

// A simple regex to detect import sources. This is only used on
// <script lang="ts"> blocks in vue (setup only) or svelte files, since
// seemingly unused imports are dropped by esbuild when transpiling TS which
// prevents it from crawling further.
// We can't use es-module-lexer because it can't handle TS, and don't want to
// use Acorn because it's slow. Luckily this doesn't have to be bullet proof
// since even missed imports can be caught at runtime, and false positives will
// simply be ignored.
export const importsRE =
  /(?<!\/\/.*)(?<=^|;|\*\/)\s*import(?!\s+type)(?:[\w*{}\n\r\t, ]+from)?\s*("[^"]+"|'[^']+')\s*(?=$|;|\/\/|\/\*)/gm

export function scanImports(config: ResolvedConfig): {
  cancel: () => Promise<void>
  result: Promise<{
    deps: Record<string, string>
    missing: Record<string, string>
  }>
} {
  // Only used to scan non-ssr code 仅用于扫描非ssr代码

  const start = performance.now() // 启动时间
  const deps: Record<string, string> = {} // 扫描到的依赖集合
  const missing: Record<string, string> = {}
  let entries: string[]

  const scanContext = { cancelled: false }

  // 根据配置计算和解析入口文件集合，并且借助 esbuild 处理依赖预构建(会将扫描到的依赖生成到 deps 变量中)
  const esbuildContext: Promise<BuildContext | undefined> = computeEntries(
    config,
  ).then((computedEntries) => {
    // 扫描的入口文件路径集合：["D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/index.html"]
    entries = computedEntries

    if (!entries.length) {
      if (!config.optimizeDeps.entries && !config.optimizeDeps.include) {
        config.logger.warn(
          colors.yellow(
            '(!) Could not auto-determine entry point from rollupOptions or html files ' + // '(!) 无法从 rollupOptions 或 html 文件自动确定入口点 '
              'and there are no explicit optimizeDeps.include patterns. ' + // 并且没有明确的 OptimizeDeps.include 模式。
              'Skipping dependency pre-bundling.', // 跳过依赖项预捆绑。
          ),
        )
      }
      return
    }
    if (scanContext.cancelled) return // 取消标识为真的话, 退出

    debug?.(
      `Crawling dependencies using entries: ${entries // 使用条目爬取依赖项：
        .map((entry) => `\n  ${colors.dim(entry)}`)
        .join('')}`,
    )
    return prepareEsbuildScanner(config, entries, deps, missing, scanContext)
  })

  const result = esbuildContext
    .then((context) => {
      function disposeContext() {
        return context?.dispose().catch((e) => {
          config.logger.error('Failed to dispose esbuild context', { error: e }) // 无法处置 esbuild 上下文
        })
      }
      if (!context || scanContext?.cancelled) {
        disposeContext()
        return { deps: {}, missing: {} }
      }
      return context
        .rebuild()
        .then(() => {
          return {
            // Ensure a fixed order so hashes are stable and improve logs 确保固定顺序，使哈希稳定并改进日志
            deps: orderedDependencies(deps),
            missing,
          }
        })
        .finally(() => {
          return disposeContext()
        })
    })
    .catch(async (e) => {
      if (e.errors && e.message.includes('The build was canceled')) {
        // esbuild logs an error when cancelling, but this is expected so
        // return an empty result instead
        return { deps: {}, missing: {} }
      }

      const prependMessage = colors.red(`\
  Failed to scan for dependencies from entries:
  ${entries.join('\n')}

  `)
      if (e.errors) {
        const msgs = await formatMessages(e.errors, {
          kind: 'error',
          color: true,
        })
        e.message = prependMessage + msgs.join('\n')
      } else {
        e.message = prependMessage + e.message
      }
      throw e
    })
    .finally(() => {
      if (debug) {
        const duration = (performance.now() - start).toFixed(2)
        const depsStr =
          Object.keys(orderedDependencies(deps))
            .sort()
            .map((id) => `\n  ${colors.cyan(id)} -> ${colors.dim(deps[id])}`)
            .join('') || colors.dim('no dependencies found')
        debug(`Scan completed in ${duration}ms: ${depsStr}`)
      }
    })

  return {
    cancel: async () => {
      scanContext.cancelled = true
      return esbuildContext.then((context) => context?.cancel())
    },
    result,
  }
}

/**
 * 根据配置计算和解析入口文件集合
 *
 * @param config 解析后的配置对象，包含优化依赖和构建选项等配置。
 * @returns 返回一个字符串数组，包含解析后的入口文件路径。
 */
async function computeEntries(config: ResolvedConfig) {
  let entries: string[] = []

  // optimizeDeps.entries: 指定自定义条目 -- https://cn.vitejs.dev/config/dep-optimization-options#optimizedeps-entries
  // 默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项，如果指定了 build.rollupOptions.input，Vite 将转而去抓取这些入口点。
  const explicitEntryPatterns = config.optimizeDeps.entries
  const buildInput = config.build.rollupOptions?.input

  if (explicitEntryPatterns) {
    // 如果指定了 optimizeDeps.entries 自定义条目的话，以这个为准
    entries = await globEntries(explicitEntryPatterns, config)
  } else if (buildInput) {
    // 如果指定了 build.rollupOptions.input，则将转而去抓取这些入口点
    const resolvePath = (p: string) => path.resolve(config.root, p)
    if (typeof buildInput === 'string') {
      entries = [resolvePath(buildInput)]
    } else if (Array.isArray(buildInput)) {
      entries = buildInput.map(resolvePath)
    } else if (isObject(buildInput)) {
      entries = Object.values(buildInput).map(resolvePath)
    } else {
      throw new Error('invalid rollupOptions.input value.') // rollupOptions.input 值无效
    }
  } else {
    // 默认情况下, 抓取你的 index.html -- "D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/index.html"
    entries = await globEntries('**/*.html', config)
  }

  // Non-supported entry file types and virtual files should not be scanned for 不应扫描不支持的条目文件类型和虚拟文件
  // dependencies.
  entries = entries.filter(
    (entry) =>
      isScannable(entry, config.optimizeDeps.extensions) && // 该入口是一个可扫描的文件
      fs.existsSync(entry), // 并且存在这个文件
  )

  return entries
}

/**
 * 在这里借助 esbuild 处理依赖预构建
 *  1. 生成一个 esbuild 扫描插件，插件中会将扫描到的预构建依赖收集到 deps 入参对象中
 *  2. 调用 esbuild.context 启动一下构建流程, 快速扫描一下自动查找需要处理的依赖
 */
async function prepareEsbuildScanner(
  config: ResolvedConfig, // 配置对象
  entries: string[], // 入口文件路径集合
  deps: Record<string, string>, //
  missing: Record<string, string>,
  scanContext?: { cancelled: boolean },
): Promise<BuildContext | undefined> {
  const container = await createPluginContainer(config) // 创建插件容器

  if (scanContext?.cancelled) return // 如果已经取消扫描的话, 直接退出

  const plugin = esbuildScanPlugin(config, container, deps, missing, entries) // 生成一个 esbuild 扫描插件

  // optimizeDeps.esbuildOptions：在依赖扫描和优化过程中传递给 esbuild 的选项。
  const { plugins = [], ...esbuildOptions } =
    config.optimizeDeps?.esbuildOptions ?? {}

  // The plugin pipeline automatically loads the closest tsconfig.json. 插件管道自动加载最接近的 tsconfig.json。
  // But esbuild doesn't support reading tsconfig.json if the plugin has resolved the path (https://github.com/evanw/esbuild/issues/2265). 但如果插件已解析路径，则 esbuild 不支持读取 tsconfig.json (https://github.com/evanw/esbuild/issues/2265)。
  // Due to syntax incompatibilities between the experimental decorators in TypeScript and TC39 decorators, 由于 TypeScript 中的实验装饰器和 TC39 装饰器之间的语法不兼容，
  // we cannot simply set `"experimentalDecorators": true` or `false`. (https://github.com/vitejs/vite/pull/15206#discussion_r1417414715) 我们不能简单地设置 `"experimentalDecorators": true` 或 `false`。 （https://github.com/vitejs/vite/pull/15206#discussion_r1417414715）
  // Therefore, we use the closest tsconfig.json from the root to make it work in most cases. 因此，我们使用距根最近的 tsconfig.json 来使其在大多数情况下都能工作。
  let tsconfigRaw = esbuildOptions.tsconfigRaw // 该配置项可以被用来将你的 tsconfig.json 文件传递给 transform API， 其不会访问文件系统。 -- https://esbuild.bootcss.com/api/#tsconfig-raw
  // esbuildOptions.tsconfig: 正常情况下 build API 会自动发现 tsconfig.json 文件，并且在构建时读取其内容。 然而，你也可以配置使用一个自定义 tsconfig.json 文件。 -- https://esbuild.bootcss.com/api/#tsconfig
  if (!tsconfigRaw && !esbuildOptions.tsconfig) {
    // 读取 tsconfig 配置文件内容
    const tsconfigResult = await loadTsconfigJsonForFile(
      path.join(config.root, '_dummy.js'),
    )
    if (tsconfigResult.compilerOptions?.experimentalDecorators) {
      tsconfigRaw = { compilerOptions: { experimentalDecorators: true } }
    }
  }

  return await esbuild.context({
    // 构建的工作目录
    absWorkingDir: process.cwd(),
    // build API 可以写入文件系统中，也可以返回本应作为内存缓冲区写入的文件。
    write: false,
    // 通常，build API 调用接受一个或多个文件名作为输入。但是，这个配置项可以用于在文件系统上根本不存在模块 的情况下运行构建。它被称为 "stdin"，因为它对应于在命令行上用管道将文件连接到 stdin。
    stdin: {
      contents: entries.map((e) => `import ${JSON.stringify(e)}`).join('\n'), // 入口文件列表生成一份读取入口文件的内容, 从这里开始构建
      loader: 'js',
    },
    // 打包一个文件意味着将任何导入的依赖项内联到文件中。 这个过程是递归的，因为依赖的依赖（等等）也将被内联。
    bundle: true,
    // 为生成的 JavaScript 文件设置输出格式。有三个可能的值：iife、cjs 与 esm。
    format: 'esm',
    logLevel: 'silent',
    // 插件列表
    plugins: [...plugins, plugin],
    // 在依赖扫描和优化过程中传递给 esbuild 的选项。
    ...esbuildOptions,
    //  该配置项可以被用来将你的 tsconfig.json 文件传递给 transform API， 其不会访问文件系统。 -- https://esbuild.bootcss.com/api/#tsconfig-raw
    tsconfigRaw,
  })
}

function orderedDependencies(deps: Record<string, string>) {
  const depsList = Object.entries(deps)
  // Ensure the same browserHash for the same set of dependencies
  depsList.sort((a, b) => a[0].localeCompare(b[0]))
  return Object.fromEntries(depsList)
}

// 获取 glob 模式(如果使用了的话)的入口文件路径
function globEntries(pattern: string | string[], config: ResolvedConfig) {
  const resolvedPatterns = arraify(pattern) // 规范为数组：["**/*.html",]
  // 传递的模式都不是动态模式
  if (resolvedPatterns.every((str) => !glob.isDynamicPattern(str))) {
    // 那么根据根目录的规范为绝对路径返回即可
    return resolvedPatterns.map((p) =>
      normalizePath(path.resolve(config.root, p)),
    )
  }
  // 根据 fast-glob 库的 glob 模式 查找对应的入口文件
  return glob(pattern, {
    cwd: config.root,
    ignore: [
      '**/node_modules/**',
      `**/${config.build.outDir}/**`,
      // if there aren't explicit entries, also ignore other common folders 如果没有明确的条目，也忽略其他常见文件夹
      ...(config.optimizeDeps.entries
        ? []
        : [`**/__tests__/**`, `**/coverage/**`]),
    ],
    absolute: true,
    suppressErrors: true, // suppress EACCES errors 抑制 EACCES 错误
  })
}

export const scriptRE =
  /(<script(?:\s+[a-z_:][-\w:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^"'<>=\s]+))?)*\s*>)(.*?)<\/script>/gis
export const commentRE = /<!--.*?-->/gs
const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i
const typeRE = /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i
const langRE = /\blang\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i
const contextRE = /\bcontext\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i

// 生成一个 esbuild 扫描插件 -- 在这里会将扫描到的预构建依赖收集到 depImports 中
function esbuildScanPlugin(
  config: ResolvedConfig,
  container: PluginContainer,
  depImports: Record<string, string>,
  missing: Record<string, string>,
  entries: string[],
): Plugin {
  const seen = new Map<string, string | undefined>()

  const resolve = async (
    id: string,
    importer?: string,
    options?: ResolveIdOptions,
  ) => {
    const key = id + (importer && path.dirname(importer))
    if (seen.has(key)) {
      return seen.get(key)
    }
    const resolved = await container.resolveId(
      id,
      importer && normalizePath(importer),
      {
        ...options,
        scan: true,
      },
    )
    const res = resolved?.id
    seen.set(key, res)
    return res
  }

  const include = config.optimizeDeps?.include
  const exclude = [
    ...(config.optimizeDeps?.exclude || []),
    '@vite/client',
    '@vite/env',
  ]

  const isUnlessEntry = (path: string) => !entries.includes(path)

  const externalUnlessEntry = ({ path }: { path: string }) => ({
    path,
    external: isUnlessEntry(path),
  })

  const doTransformGlobImport = async (
    contents: string,
    id: string,
    loader: Loader,
  ) => {
    let transpiledContents
    // transpile because `transformGlobImport` only expects js
    if (loader !== 'js') {
      transpiledContents = (await transform(contents, { loader })).code
    } else {
      transpiledContents = contents
    }

    const result = await transformGlobImport(
      transpiledContents,
      id,
      config.root,
      resolve,
    )

    return result?.s.toString() || transpiledContents
  }

  return {
    name: 'vite:dep-scan',
    setup(build) {
      const scripts: Record<string, OnLoadResult> = {}

      // external urls
      build.onResolve({ filter: externalRE }, ({ path }) => ({
        path,
        external: true,
      }))

      // data urls
      build.onResolve({ filter: dataUrlRE }, ({ path }) => ({
        path,
        external: true,
      }))

      // local scripts (`<script>` in Svelte and `<script setup>` in Vue)
      build.onResolve({ filter: virtualModuleRE }, ({ path }) => {
        return {
          // strip prefix to get valid filesystem path so esbuild can resolve imports in the file
          path: path.replace(virtualModulePrefix, ''),
          namespace: 'script',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'script' }, ({ path }) => {
        return scripts[path]
      })

      // html types: extract script contents -----------------------------------
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer)
        if (!resolved) return
        // It is possible for the scanner to scan html types in node_modules.
        // If we can optimize this html type, skip it so it's handled by the
        // bare import resolve, and recorded as optimization dep.
        if (
          isInNodeModules(resolved) &&
          isOptimizable(resolved, config.optimizeDeps)
        )
          return
        return {
          path: resolved,
          namespace: 'html',
        }
      })

      const htmlTypeOnLoadCallback: (
        args: OnLoadArgs,
      ) => Promise<OnLoadResult | null | undefined> = async ({ path: p }) => {
        let raw = await fsp.readFile(p, 'utf-8')
        // Avoid matching the content of the comment
        raw = raw.replace(commentRE, '<!---->')
        const isHtml = p.endsWith('.html')
        let js = ''
        let scriptId = 0
        const matches = raw.matchAll(scriptRE)
        for (const [, openTag, content] of matches) {
          const typeMatch = openTag.match(typeRE)
          const type =
            typeMatch && (typeMatch[1] || typeMatch[2] || typeMatch[3])
          const langMatch = openTag.match(langRE)
          const lang =
            langMatch && (langMatch[1] || langMatch[2] || langMatch[3])
          // skip non type module script
          if (isHtml && type !== 'module') {
            continue
          }
          // skip type="application/ld+json" and other non-JS types
          if (
            type &&
            !(
              type.includes('javascript') ||
              type.includes('ecmascript') ||
              type === 'module'
            )
          ) {
            continue
          }
          let loader: Loader = 'js'
          if (lang === 'ts' || lang === 'tsx' || lang === 'jsx') {
            loader = lang
          } else if (p.endsWith('.astro')) {
            loader = 'ts'
          }
          const srcMatch = openTag.match(srcRE)
          if (srcMatch) {
            const src = srcMatch[1] || srcMatch[2] || srcMatch[3]
            js += `import ${JSON.stringify(src)}\n`
          } else if (content.trim()) {
            // The reason why virtual modules are needed:
            // 1. There can be module scripts (`<script context="module">` in Svelte and `<script>` in Vue)
            // or local scripts (`<script>` in Svelte and `<script setup>` in Vue)
            // 2. There can be multiple module scripts in html
            // We need to handle these separately in case variable names are reused between them

            // append imports in TS to prevent esbuild from removing them
            // since they may be used in the template
            const contents =
              content +
              (loader.startsWith('ts') ? extractImportPaths(content) : '')

            const key = `${p}?id=${scriptId++}`
            if (contents.includes('import.meta.glob')) {
              scripts[key] = {
                loader: 'js', // since it is transpiled
                contents: await doTransformGlobImport(contents, p, loader),
                resolveDir: normalizePath(path.dirname(p)),
                pluginData: {
                  htmlType: { loader },
                },
              }
            } else {
              scripts[key] = {
                loader,
                contents,
                resolveDir: normalizePath(path.dirname(p)),
                pluginData: {
                  htmlType: { loader },
                },
              }
            }

            const virtualModulePath = JSON.stringify(virtualModulePrefix + key)

            const contextMatch = openTag.match(contextRE)
            const context =
              contextMatch &&
              (contextMatch[1] || contextMatch[2] || contextMatch[3])

            // Especially for Svelte files, exports in <script context="module"> means module exports,
            // exports in <script> means component props. To avoid having two same export name from the
            // star exports, we need to ignore exports in <script>
            if (p.endsWith('.svelte') && context !== 'module') {
              js += `import ${virtualModulePath}\n`
            } else {
              js += `export * from ${virtualModulePath}\n`
            }
          }
        }

        // This will trigger incorrectly if `export default` is contained
        // anywhere in a string. Svelte and Astro files can't have
        // `export default` as code so we know if it's encountered it's a
        // false positive (e.g. contained in a string)
        if (!p.endsWith('.vue') || !js.includes('export default')) {
          js += '\nexport default {}'
        }

        return {
          loader: 'js',
          contents: js,
        }
      }

      // extract scripts inside HTML-like files and treat it as a js module
      build.onLoad(
        { filter: htmlTypesRE, namespace: 'html' },
        htmlTypeOnLoadCallback,
      )
      // the onResolve above will use namespace=html but esbuild doesn't
      // call onResolve for glob imports and those will use namespace=file
      // https://github.com/evanw/esbuild/issues/3317
      build.onLoad(
        { filter: htmlTypesRE, namespace: 'file' },
        htmlTypeOnLoadCallback,
      )

      // bare imports: record and externalize ----------------------------------
      build.onResolve(
        {
          // avoid matching windows volume
          filter: /^[\w@][^:]/,
        },
        async ({ path: id, importer, pluginData }) => {
          if (moduleListContains(exclude, id)) {
            return externalUnlessEntry({ path: id })
          }
          if (depImports[id]) {
            return externalUnlessEntry({ path: id })
          }
          const resolved = await resolve(id, importer, {
            custom: {
              depScan: { loader: pluginData?.htmlType?.loader },
            },
          })
          if (resolved) {
            if (shouldExternalizeDep(resolved, id)) {
              return externalUnlessEntry({ path: id })
            }
            if (isInNodeModules(resolved) || include?.includes(id)) {
              // dependency or forced included, externalize and stop crawling 依赖或强制包含、外部化并停止爬行
              if (isOptimizable(resolved, config.optimizeDeps)) {
                depImports[id] = resolved
              }
              return externalUnlessEntry({ path: id })
            } else if (isScannable(resolved, config.optimizeDeps.extensions)) {
              const namespace = htmlTypesRE.test(resolved) ? 'html' : undefined
              // linked package, keep crawling
              return {
                path: path.resolve(resolved),
                namespace,
              }
            } else {
              return externalUnlessEntry({ path: id })
            }
          } else {
            missing[id] = normalizePath(importer)
          }
        },
      )

      // Externalized file types -----------------------------------------------
      // these are done on raw ids using esbuild's native regex filter so it
      // should be faster than doing it in the catch-all via js
      // they are done after the bare import resolve because a package name
      // may end with these extensions
      const setupExternalize = (
        filter: RegExp,
        doExternalize: (path: string) => boolean,
      ) => {
        build.onResolve({ filter }, ({ path }) => {
          return {
            path,
            external: doExternalize(path),
          }
        })
      }

      // css
      setupExternalize(CSS_LANGS_RE, isUnlessEntry)
      // json & wasm
      setupExternalize(/\.(json|json5|wasm)$/, isUnlessEntry)
      // known asset types
      setupExternalize(
        new RegExp(`\\.(${KNOWN_ASSET_TYPES.join('|')})$`),
        isUnlessEntry,
      )
      // known vite query types: ?worker, ?raw
      setupExternalize(SPECIAL_QUERY_RE, () => true)

      // catch all -------------------------------------------------------------

      build.onResolve(
        {
          filter: /.*/,
        },
        async ({ path: id, importer, pluginData }) => {
          // use vite resolver to support urls and omitted extensions
          const resolved = await resolve(id, importer, {
            custom: {
              depScan: { loader: pluginData?.htmlType?.loader },
            },
          })
          if (resolved) {
            if (
              shouldExternalizeDep(resolved, id) ||
              !isScannable(resolved, config.optimizeDeps.extensions)
            ) {
              return externalUnlessEntry({ path: id })
            }

            const namespace = htmlTypesRE.test(resolved) ? 'html' : undefined

            return {
              path: path.resolve(cleanUrl(resolved)),
              namespace,
            }
          } else {
            // resolve failed... probably unsupported type
            return externalUnlessEntry({ path: id })
          }
        },
      )

      // for jsx/tsx, we need to access the content and check for
      // presence of import.meta.glob, since it results in import relationships
      // but isn't crawled by esbuild.
      build.onLoad({ filter: JS_TYPES_RE }, async ({ path: id }) => {
        let ext = path.extname(id).slice(1)
        if (ext === 'mjs') ext = 'js'

        let contents = await fsp.readFile(id, 'utf-8')
        if (ext.endsWith('x') && config.esbuild && config.esbuild.jsxInject) {
          contents = config.esbuild.jsxInject + `\n` + contents
        }

        const loader =
          config.optimizeDeps?.esbuildOptions?.loader?.[`.${ext}`] ||
          (ext as Loader)

        if (contents.includes('import.meta.glob')) {
          return {
            loader: 'js', // since it is transpiled,
            contents: await doTransformGlobImport(contents, id, loader),
          }
        }

        return {
          loader,
          contents,
        }
      })

      // onResolve is not called for glob imports.
      // we need to add that here as well until esbuild calls onResolve for glob imports.
      // https://github.com/evanw/esbuild/issues/3317
      build.onLoad({ filter: /.*/, namespace: 'file' }, () => {
        return {
          loader: 'js',
          contents: 'export default {}',
        }
      })
    },
  }
}

/**
 * when using TS + (Vue + `<script setup>`) or Svelte, imports may seem
 * unused to esbuild and dropped in the build output, which prevents
 * esbuild from crawling further.
 * the solution is to add `import 'x'` for every source to force
 * esbuild to keep crawling due to potential side effects.
 */
function extractImportPaths(code: string) {
  // empty singleline & multiline comments to avoid matching comments
  code = code
    .replace(multilineCommentsRE, '/* */')
    .replace(singlelineCommentsRE, '')

  let js = ''
  let m
  importsRE.lastIndex = 0
  while ((m = importsRE.exec(code)) != null) {
    js += `\nimport ${m[1]}`
  }
  return js
}

function shouldExternalizeDep(resolvedId: string, rawId: string): boolean {
  // not a valid file path
  if (!path.isAbsolute(resolvedId)) {
    return true
  }
  // virtual id
  if (resolvedId === rawId || resolvedId.includes('\0')) {
    return true
  }
  return false
}

/**
 * 检查给定的 id 是否表示一个可扫描的文件。
 * @param id 要检查的文件标识符。
 * @param extensions 可选，文件的扩展名列表，用于进一步筛选。
 * @returns 返回一个布尔值，表示 id 是否表示一个应该被扫描的文件。
 */
function isScannable(id: string, extensions: string[] | undefined): boolean {
  // 检查 id 是否匹配 JavaScript 类型的正则表达式，
  // 或者是否匹配 HTML 类型的正则表达式，
  // 或者是否在给定的扩展名列表中，
  // 如果都不匹配，则返回 false。
  return (
    JS_TYPES_RE.test(id) ||
    htmlTypesRE.test(id) ||
    extensions?.includes(path.extname(id)) ||
    false
  )
}

import fsp from 'node:fs/promises'
import path from 'node:path'
import MagicString from 'magic-string'
import type { SourceMapInput } from 'rollup'
import type { Connect } from 'dep-types/connect'
import type { DefaultTreeAdapterMap, Token } from 'parse5'
import type { IndexHtmlTransformHook } from '../../plugins/html'
import {
  addToHTMLProxyCache,
  applyHtmlTransforms,
  assetAttrsConfig,
  extractImportExpressionFromClassicScript,
  findNeedTransformStyleAttribute,
  getAttrKey,
  getScriptInfo,
  htmlEnvHook,
  htmlProxyResult,
  injectCspNonceMetaTagHook,
  injectNonceAttributeTagHook,
  nodeIsElement,
  overwriteAttrValue,
  postImportMapHook,
  preImportMapHook,
  resolveHtmlTransforms,
  traverseHtml,
} from '../../plugins/html'
import type { PreviewServer, ResolvedConfig, ViteDevServer } from '../..'
import { send } from '../send'
import { CLIENT_PUBLIC_PATH, FS_PREFIX } from '../../constants'
import {
  ensureWatchedFile,
  fsPathFromId,
  getHash,
  injectQuery,
  isDevServer,
  isJSRequest,
  joinUrlSegments,
  normalizePath,
  processSrcSetSync,
  stripBase,
} from '../../utils'
import { getFsUtils } from '../../fsUtils'
import { checkPublicFile } from '../../publicDir'
import { isCSSRequest } from '../../plugins/css'
import { getCodeWithSourcemap, injectSourcesContent } from '../sourcemap'
import { cleanUrl, unwrapId, wrapId } from '../../../shared/utils'

interface AssetNode {
  start: number
  end: number
  code: string
}

interface InlineStyleAttribute {
  index: number
  location: Token.Location
  code: string
}

// 创建一个用于开发环境HTML转换的函数。
export function createDevHtmlTransformFn(
  config: ResolvedConfig,
): (
  server: ViteDevServer,
  url: string,
  html: string,
  originalUrl?: string,
) => Promise<string> {
  // 解析并组织插件 transformIndexHtml 钩子。
  const [preHooks, normalHooks, postHooks] = resolveHtmlTransforms(
    config.plugins,
    config.logger,
  )
  const transformHooks = [
    // 定义一个预导入映射钩子函数，用于在HTML中检查`<script type="importmap">`的位置，
    // 确保它位于`<script type="module">`和`<link rel="modulepreload">`标签之前。
    preImportMapHook(config),
    // 向HTML中注入CSP（内容安全策略）nonce值的meta标签。
    // CSP nonce可以用于确保页面内的脚本和样式等资源在加载时具有一个随时间变化的令牌，
    // 以此加强内容安全策略，防止XSS等安全威胁。
    injectCspNonceMetaTagHook(config),
    ...preHooks,
    // 生成一个用于在HTML中插入环境变量的 transformIndexHtml 钩子函数。
    htmlEnvHook(config),
    // 在开发环境下转换 html 的钩子
    // 使用 parse5 解析器解析 html, 并遍历每个节点
    // 处理一些标签节点
    // 并且插入一个 script 标签，引入 /@vite/client 文件，用于客户端与服务器通信
    devHtmlHook,
    ...normalHooks,
    ...postHooks,
    // 向HTML中的特定标签（script, style, 以及具有特定rel属性的link标签）注入nonce（一次性令牌）属性，
    // 以增强内容安全策略（CSP）。
    injectNonceAttributeTagHook(config),
    postImportMapHook(),
  ]
  // 返回一个 HTML转换 的方法
  return (
    /** vite 服务器实例 */
    server: ViteDevServer,
    /** 请求 url --> /index.html */
    url: string,
    /** html 文件内容 */
    html: string,
    /** 原始请求 url --> / */
    originalUrl?: string,
  ): Promise<string> => {
    return applyHtmlTransforms(html, transformHooks, {
      path: url,
      filename: getHtmlFilename(url, server),
      server,
      originalUrl,
    })
  }
}

function getHtmlFilename(url: string, server: ViteDevServer) {
  if (url.startsWith(FS_PREFIX)) {
    return decodeURIComponent(fsPathFromId(url))
  } else {
    return decodeURIComponent(
      normalizePath(path.join(server.config.root, url.slice(1))),
    )
  }
}

// 判断URL是否需要预处理。
function shouldPreTransform(url: string, config: ResolvedConfig) {
  // 检查URL是否不是公共文件且是JS或CSS请求
  return (
    !checkPublicFile(url, config) && (isJSRequest(url) || isCSSRequest(url))
  )
}

const wordCharRE = /\w/

function isBareRelative(url: string) {
  return wordCharRE.test(url[0]) && !url.includes(':')
}

const isSrcSet = (attr: Token.Attribute) =>
  attr.name === 'srcset' && attr.prefix === undefined
const processNodeUrl = (
  url: string,
  useSrcSetReplacer: boolean,
  config: ResolvedConfig,
  htmlPath: string,
  originalUrl?: string,
  server?: ViteDevServer,
  isClassicScriptLink?: boolean,
): string => {
  // prefix with base (dev only, base is never relative) 带基数的前缀（仅限开发，基数从来不是相对的）
  const replacer = (url: string) => {
    // 如果存在模块图的话
    if (server?.moduleGraph) {
      const mod = server.moduleGraph.urlToModuleMap.get(url)
      if (mod && mod.lastHMRTimestamp > 0) {
        url = injectQuery(url, `t=${mod.lastHMRTimestamp}`)
      }
    }

    if (
      (url[0] === '/' && url[1] !== '/') ||
      // #3230 if some request url (localhost:3000/a/b) return to fallback html, the relative assets #3230如果一些请求url（localhost:3000/a/b）返回到回退html，则相对资产
      // path will add `/a/` prefix, it will caused 404. 路径将添加“/a/”前缀，它将导致404。
      //
      // skip if url contains `:` as it implies a url protocol or Windows path that we don't want to replace. 如果url包含“：”，则跳过，因为这意味着我们不想替换的url协议或Windows路径。
      //
      // rewrite `./index.js` -> `localhost:5173/a/index.js`. 重写index.js`->`localhost:5173/a/index.js`。
      // rewrite `../index.js` -> `localhost:5173/index.js`. 重写index.js`->`localhost:5173/index.js`。
      // rewrite `relative/index.js` -> `localhost:5173/a/relative/index.js`. 重写`relative/index.js`->`localhost:5173/a/rerelative/index.js`。
      ((url[0] === '.' || isBareRelative(url)) &&
        originalUrl &&
        originalUrl !== '/' &&
        htmlPath === '/index.html')
    ) {
      url = path.posix.join(config.base, url)
    }

    // 检查该脚本元素的 src 属性对应的 url 是否需要预处理
    // 因为当请求了 html 之后, 随之而来的就是这些 html 中的请求资源
    // 在这里做预处理后, 节省一些浏览器等待时间
    if (server && !isClassicScriptLink && shouldPreTransform(url, config)) {
      let preTransformUrl: string | undefined
      if (url[0] === '/' && url[1] !== '/') {
        preTransformUrl = url
      } else if (url[0] === '.' || isBareRelative(url)) {
        preTransformUrl = path.posix.join(
          config.base,
          path.posix.dirname(htmlPath),
          url,
        )
      }
      // 需要预处理的 url
      if (preTransformUrl) {
        // 启动预处理的请求，后台执行，不阻塞主线程的执行
        preTransformRequest(server, preTransformUrl, config.base)
      }
    }
    return url
  }

  const processedUrl = useSrcSetReplacer
    ? processSrcSetSync(url, ({ url }) => replacer(url))
    : replacer(url)
  return processedUrl
}

// 在开发环境下转换 html 的钩子
// 使用 parse5 解析器解析 html, 并遍历每个节点
// 处理一些标签节点
// 并且插入一个 script 标签，引入 /@vite/client 文件，用于客户端与服务器通信
const devHtmlHook: IndexHtmlTransformHook = async (
  html,
  { path: htmlPath, filename, server, originalUrl },
) => {
  const { config, moduleGraph, watcher } = server!
  const base = config.base || '/' // 公共基础路径

  let proxyModulePath: string // html 文件路径
  let proxyModuleUrl: string

  const trailingSlash = htmlPath.endsWith('/') // html 文件路径不是以 / 结尾的
  if (!trailingSlash && getFsUtils(config).existsSync(filename)) {
    proxyModulePath = htmlPath
    proxyModuleUrl = proxyModulePath
  } else {
    // There are users of vite.transformIndexHtml calling it with url '/' 有 vite.transformIndexHtml 的用户使用 url “/” 调用它
    // for SSR integrations #7993, filename is root for this case 对于SSR集成#7993，filename 是本例的 root
    // A user may also use a valid name for a virtual html file 用户还可以使用虚拟html文件的有效名称
    // Mark the path as virtual in both cases so sourcemaps aren't processed 在这两种情况下都将路径标记为虚拟路径，这样就不会处理源映射
    // and ids are properly handled 并且id得到了正确的处理
    const validPath = `${htmlPath}${trailingSlash ? 'index.html' : ''}`
    proxyModulePath = `\0${validPath}`
    proxyModuleUrl = wrapId(proxyModulePath)
  }
  proxyModuleUrl = joinUrlSegments(base, proxyModuleUrl) // 基于 base 处理路径 --> /index.html

  const s = new MagicString(html)
  let inlineModuleIndex = -1
  // The key to the proxyHtml cache is decoded, as it will be compared proxyHtml 缓存的键被解码，因为它将被比较
  // against decoded URLs by the HTML plugins. 针对 HTML 插件解码的 URL。
  const proxyCacheUrl = decodeURI(
    cleanUrl(proxyModulePath).replace(normalizePath(config.root), ''),
  )
  const styleUrl: AssetNode[] = [] // 需要处理的内嵌样式
  const inlineStyles: InlineStyleAttribute[] = [] // 需要处理行内样式集合：处理 url( 和 image-set(

  const addInlineModule = (
    node: DefaultTreeAdapterMap['element'],
    ext: 'js',
  ) => {
    inlineModuleIndex++

    const contentNode = node.childNodes[0] as DefaultTreeAdapterMap['textNode']

    const code = contentNode.value

    let map: SourceMapInput | undefined
    if (proxyModulePath[0] !== '\0') {
      map = new MagicString(html)
        .snip(
          contentNode.sourceCodeLocation!.startOffset,
          contentNode.sourceCodeLocation!.endOffset,
        )
        .generateMap({ hires: 'boundary' })
      map.sources = [filename]
      map.file = filename
    }

    // add HTML Proxy to Map
    addToHTMLProxyCache(config, proxyCacheUrl, inlineModuleIndex, { code, map })

    // inline js module. convert to src="proxy" (dev only, base is never relative)
    const modulePath = `${proxyModuleUrl}?html-proxy&index=${inlineModuleIndex}.${ext}`

    // invalidate the module so the newly cached contents will be served
    const module = server?.moduleGraph.getModuleById(modulePath)
    if (module) {
      server?.moduleGraph.invalidateModule(module)
    }
    s.update(
      node.sourceCodeLocation!.startOffset,
      node.sourceCodeLocation!.endOffset,
      `<script type="module" src="${modulePath}"></script>`,
    )
    preTransformRequest(server!, modulePath, base)
  }

  // 使用 parse5 解析器解析 html, 并遍历每个节点
  // 处理一些标签节点
  await traverseHtml(html, filename, (node) => {
    // 如果不是元素节点, 则不处理
    if (!nodeIsElement(node)) {
      return
    }

    // script tags 脚本标签
    if (node.nodeName === 'script') {
      const { src, sourceCodeLocation, isModule } = getScriptInfo(node)
      // 如果存在 src 的话
      if (src) {
        const processedUrl = processNodeUrl(
          src.value,
          isSrcSet(src),
          config,
          htmlPath,
          originalUrl,
          server,
          !isModule,
        )
        if (processedUrl !== src.value) {
          overwriteAttrValue(s, sourceCodeLocation!, processedUrl)
        }
      } else if (isModule && node.childNodes.length) {
        addInlineModule(node, 'js')
      } else if (node.childNodes.length) {
        const scriptNode = node.childNodes[
          node.childNodes.length - 1
        ] as DefaultTreeAdapterMap['textNode']
        for (const {
          url,
          start,
          end,
        } of extractImportExpressionFromClassicScript(scriptNode)) {
          const processedUrl = processNodeUrl(
            url,
            false,
            config,
            htmlPath,
            originalUrl,
          )
          if (processedUrl !== url) {
            s.update(start, end, processedUrl)
          }
        }
      }
    }

    // 当元素中存在 行内样式 时，并且存在 url(、或 image-set( 时，返回其位置以及其 code
    // 并添加到 inlineStyles 集合中
    // 例如： <div style="background-image: url('/test.js')"></div>  生成
    // {
    //   attr: {
    //     name: "style",
    //     value: "background-image: url('/test.js')",
    //   },
    //   location: {
    //     startLine: 11,
    //     startCol: 10,
    //     startOffset: 296,
    //     endLine: 11,
    //     endCol: 51,
    //     endOffset: 337,
    //   },
    // }
    const inlineStyle = findNeedTransformStyleAttribute(node)
    if (inlineStyle) {
      inlineModuleIndex++
      // 添加进待处理的行内样式集合
      inlineStyles.push({
        index: inlineModuleIndex,
        location: inlineStyle.location!,
        code: inlineStyle.attr.value,
      })
    }

    // 如果是 style 标签, 并且是内嵌样式的
    if (node.nodeName === 'style' && node.childNodes.length) {
      // 第一个子节点即包含了所有的内嵌样式
      const children = node.childNodes[0] as DefaultTreeAdapterMap['textNode']
      styleUrl.push({
        start: children.sourceCodeLocation!.startOffset,
        end: children.sourceCodeLocation!.endOffset,
        code: children.value,
      })
    }

    // elements with [href/src] attrs 具有 [href/src] 属性的元素
    const assetAttrs = assetAttrsConfig[node.nodeName] // 具有请求文件的相关元素及属性名称
    if (assetAttrs) {
      for (const p of node.attrs) {
        const attrKey = getAttrKey(p)
        if (p.value && assetAttrs.includes(attrKey)) {
          const processedUrl = processNodeUrl(
            p.value,
            isSrcSet(p),
            config,
            htmlPath,
            originalUrl,
          )
          if (processedUrl !== p.value) {
            overwriteAttrValue(
              s,
              node.sourceCodeLocation!.attrs![attrKey],
              processedUrl,
            )
          }
        }
      }
    }
  })

  await Promise.all([
    ...styleUrl.map(async ({ start, end, code }, index) => {
      const url = `${proxyModulePath}?html-proxy&direct&index=${index}.css`

      // ensure module in graph after successful load 成功加载后确保图中的模块
      const mod = await moduleGraph.ensureEntryFromUrl(url, false)
      ensureWatchedFile(watcher, mod.file, config.root)

      const result = await server!.pluginContainer.transform(code, mod.id!)
      let content = ''
      if (result) {
        if (result.map && 'version' in result.map) {
          if (result.map.mappings) {
            await injectSourcesContent(
              result.map,
              proxyModulePath,
              config.logger,
            )
          }
          content = getCodeWithSourcemap('css', result.code, result.map)
        } else {
          content = result.code
        }
      }
      s.overwrite(start, end, content)
    }),
    ...inlineStyles.map(async ({ index, location, code }) => {
      // will transform with css plugin and cache result with css-post plugin 将使用 css 插件进行转换并使用 css-post 插件缓存结果
      const url = `${proxyModulePath}?html-proxy&inline-css&style-attr&index=${index}.css`

      const mod = await moduleGraph.ensureEntryFromUrl(url, false)
      ensureWatchedFile(watcher, mod.file, config.root)

      await server?.pluginContainer.transform(code, mod.id!)

      const hash = getHash(cleanUrl(mod.id!))
      const result = htmlProxyResult.get(`${hash}_${index}`)
      overwriteAttrValue(s, location, result ?? '')
    }),
  ])

  html = s.toString()

  return {
    html,
    tags: [
      // 插入一个 script 标签，引入 /@vite/client 文件，用于客户端与服务器通信
      {
        tag: 'script',
        attrs: {
          type: 'module',
          src: path.posix.join(base, CLIENT_PUBLIC_PATH),
        },
        injectTo: 'head-prepend',
      },
    ],
  }
}

// 用于处理 html 的请求中间件
// 读取对应 html 文件, 在开发环境下, 调用 server.transformIndexHtml 方法(会调用插件 transformIndexHtml 钩子)执行转换
export function indexHtmlMiddleware(
  root: string,
  server: ViteDevServer | PreviewServer,
): Connect.NextHandleFunction {
  const isDev = isDevServer(server)
  const fsUtils = getFsUtils(server.config)

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return async function viteIndexHtmlMiddleware(req, res, next) {
    // writableEnded: 指示是否调用 request.end()
    if (res.writableEnded) {
      return next()
    }

    const url = req.url && cleanUrl(req.url) // 请求 url
    // htmlFallbackMiddleware appends '.html' to URLs htmlFallbackMiddleware 将“.html”附加到 URL
    // 表明是 .html 文件请求
    if (url?.endsWith('.html') && req.headers['sec-fetch-dest'] !== 'script') {
      let filePath: string
      if (isDev && url.startsWith(FS_PREFIX)) {
        filePath = decodeURIComponent(fsPathFromId(url))
      } else {
        filePath = path.join(root, decodeURIComponent(url)) // 请求完整地址: D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\vue\\index.html
      }

      // 检测文件是否存在
      if (fsUtils.existsSync(filePath)) {
        // 指定服务器响应的 header。
        const headers = isDev
          ? server.config.server.headers
          : server.config.preview.headers

        try {
          let html = await fsp.readFile(filePath, 'utf-8') // 读取文件
          // 如果是开发环境，调用方法转换 index.html 文件 -- 会调用插件的 transformIndexHtml 钩子执行转换机制
          if (isDev) {
            html = await server.transformIndexHtml(url, html, req.originalUrl)
          }
          return send(req, res, html, 'html', { headers })
        } catch (e) {
          return next(e)
        }
      }
    }
    next()
  }
}

/**
 * 在发送请求之前对请求进行预处理。
 * @param server Vite开发服务器实例，用于访问配置和进行请求预热。
 * @param url 需要处理的请求URL。
 * @param base 应用的基础URL。
 * 主要功能是将URL转换为非SSR模式，因为HTML只包括客户端资产。
 * 如果配置中未启用预处理请求功能，则直接退出。
 * 使用decodeURI解码URL，并移除基础URL，然后对结果进行处理。
 * 如果处理过程中出现异常，则忽略不处理。
 * 最后，使用预热请求功能对处理后的URL进行预热。
 */
function preTransformRequest(server: ViteDevServer, url: string, base: string) {
  if (!server.config.server.preTransformRequests) return // 如果不启用功能的话, 直接退出

  // transform all url as non-ssr as html includes client-side assets only 将所有 url 转换为非 ssr，因为 html 仅包含客户端资产
  try {
    url = unwrapId(stripBase(decodeURI(url), base))
  } catch {
    // ignore
    return
  }
  // 后台执行，不阻塞主线程的执行
  server.warmupRequest(url)
}

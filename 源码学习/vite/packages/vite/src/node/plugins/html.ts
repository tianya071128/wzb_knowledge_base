import path from 'node:path'
import type {
  OutputAsset,
  OutputBundle,
  OutputChunk,
  RollupError,
  SourceMapInput,
} from 'rollup'
import MagicString from 'magic-string'
import colors from 'picocolors'
import type { DefaultTreeAdapterMap, ParserError, Token } from 'parse5'
import { stripLiteral } from 'strip-literal'
import type { Plugin } from '../plugin'
import type { ViteDevServer } from '../server'
import {
  encodeURIPath,
  generateCodeFrame,
  getHash,
  isDataUrl,
  isExternalUrl,
  normalizePath,
  partialEncodeURIPath,
  processSrcSet,
  removeLeadingSlash,
  urlCanParse,
} from '../utils'
import type { ResolvedConfig } from '../config'
import { checkPublicFile } from '../publicDir'
import { toOutputFilePathInHtml } from '../build'
import { resolveEnvPrefix } from '../env'
import type { Logger } from '../logger'
import { cleanUrl } from '../../shared/utils'
import {
  assetUrlRE,
  getPublicAssetFilename,
  publicAssetUrlRE,
  urlToBuiltUrl,
} from './asset'
import { isCSSRequest } from './css'
import { modulePreloadPolyfillId } from './modulePreloadPolyfill'

interface ScriptAssetsUrl {
  start: number
  end: number
  url: string
}

const htmlProxyRE =
  /\?html-proxy=?(?:&inline-css)?(?:&style-attr)?&index=(\d+)\.(js|css)$/
const isHtmlProxyRE = /\?html-proxy\b/

const inlineCSSRE = /__VITE_INLINE_CSS__([a-z\d]{8}_\d+)__/g
// Do not allow preceding '.', but do allow preceding '...' for spread operations
const inlineImportRE =
  /(?<!(?<!\.\.)\.)\bimport\s*\(("(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*')\)/dg
const htmlLangRE = /\.(?:html|htm)$/
const spaceRe = /[\t\n\f\r ]/

const importMapRE =
  /[ \t]*<script[^>]*type\s*=\s*(?:"importmap"|'importmap'|importmap)[^>]*>.*?<\/script>/is
const moduleScriptRE =
  /[ \t]*<script[^>]*type\s*=\s*(?:"module"|'module'|module)[^>]*>/i
const modulePreloadLinkRE =
  /[ \t]*<link[^>]*rel\s*=\s*(?:"modulepreload"|'modulepreload'|modulepreload)[\s\S]*?\/>/i
const importMapAppendRE = new RegExp(
  [moduleScriptRE, modulePreloadLinkRE].map((r) => r.source).join('|'),
  'i',
)

export const isHTMLProxy = (id: string): boolean => isHtmlProxyRE.test(id)

export const isHTMLRequest = (request: string): boolean =>
  htmlLangRE.test(request)

// HTML Proxy Caches are stored by config -> filePath -> index
export const htmlProxyMap = new WeakMap<
  ResolvedConfig,
  Map<string, Array<{ code: string; map?: SourceMapInput }>>
>()

// HTML Proxy Transform result are stored by config
// `${hash(importer)}_${query.index}` -> transformed css code
// PS: key like `hash(/vite/playground/assets/index.html)_1`)
export const htmlProxyResult = new Map<string, string>()

export function htmlInlineProxyPlugin(config: ResolvedConfig): Plugin {
  // Should do this when `constructor` rather than when `buildStart`,
  // `buildStart` will be triggered multiple times then the cached result will be emptied.
  // https://github.com/vitejs/vite/issues/6372
  htmlProxyMap.set(config, new Map())
  return {
    name: 'vite:html-inline-proxy',

    resolveId(id) {
      if (isHTMLProxy(id)) {
        return id
      }
    },

    load(id) {
      const proxyMatch = id.match(htmlProxyRE)
      if (proxyMatch) {
        const index = Number(proxyMatch[1])
        const file = cleanUrl(id)
        const url = file.replace(normalizePath(config.root), '')
        const result = htmlProxyMap.get(config)!.get(url)?.[index]
        if (result) {
          return result
        } else {
          throw new Error(`No matching HTML proxy module found from ${id}`)
        }
      }
    },
  }
}

export function addToHTMLProxyCache(
  config: ResolvedConfig,
  filePath: string,
  index: number,
  result: { code: string; map?: SourceMapInput },
): void {
  if (!htmlProxyMap.get(config)) {
    htmlProxyMap.set(config, new Map())
  }
  if (!htmlProxyMap.get(config)!.get(filePath)) {
    htmlProxyMap.get(config)!.set(filePath, [])
  }
  htmlProxyMap.get(config)!.get(filePath)![index] = result
}

export function addToHTMLProxyTransformResult(
  hash: string,
  code: string,
): void {
  htmlProxyResult.set(hash, code)
}

// this extends the config in @vue/compiler-sfc with <link href> 这使用 <link href> 扩展了 @vue/compiler-sfc 中的配置
export const assetAttrsConfig: Record<string, string[]> = {
  link: ['href'],
  video: ['src', 'poster'],
  source: ['src', 'srcset'],
  img: ['src', 'srcset'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
}

// Some `<link rel>` elements should not be inlined in build. Excluding:
// - `shortcut`                     : only valid for IE <9, use `icon`
// - `mask-icon`                    : deprecated since Safari 12 (for pinned tabs)
// - `apple-touch-icon-precomposed` : only valid for iOS <7 (for avoiding gloss effect)
const noInlineLinkRels = new Set([
  'icon',
  'apple-touch-icon',
  'apple-touch-startup-image',
  'manifest',
])

export const isAsyncScriptMap = new WeakMap<
  ResolvedConfig,
  Map<string, boolean>
>()

// 检查给定的节点是否为元素节点。
export function nodeIsElement(
  node: DefaultTreeAdapterMap['node'],
): node is DefaultTreeAdapterMap['element'] {
  // 检查节点的 nodeName 字段是否以'#'开头，以判断是否为元素节点。
  return node.nodeName[0] !== '#'
}

// 遍历给定的节点及其子节点，对每个节点应用提供的访问者函数。
function traverseNodes(
  node: DefaultTreeAdapterMap['node'],
  visitor: (node: DefaultTreeAdapterMap['node']) => void,
) {
  // 应用访问者函数到当前节点
  visitor(node)

  // 如果节点是元素节点，或者是文档节点或文档片段节点，则递归遍历其子节点
  if (
    nodeIsElement(node) ||
    node.nodeName === '#document' ||
    node.nodeName === '#document-fragment'
  ) {
    node.childNodes.forEach((childNode) => traverseNodes(childNode, visitor))
  }
}

// 遍历HTML字符串并对其AST进行访问
export async function traverseHtml(
  html: string,
  filePath: string,
  visitor: (node: DefaultTreeAdapterMap['node']) => void,
): Promise<void> {
  // lazy load compiler 延迟加载编译器
  const { parse } = await import('parse5')
  // 解析HTML字符串为AST
  const ast = parse(html, {
    scriptingEnabled: false, // parse inside <noscript>
    sourceCodeLocationInfo: true,
    onParseError: (e: ParserError) => {
      // 自定义的错误处理逻辑
      handleParseError(e, html, filePath)
    },
  })
  // 使用提供的visitor函数遍历和访问AST的每个节点
  traverseNodes(ast, visitor)
}

export function getScriptInfo(node: DefaultTreeAdapterMap['element']): {
  src: Token.Attribute | undefined
  sourceCodeLocation: Token.Location | undefined
  isModule: boolean
  isAsync: boolean
} {
  let src: Token.Attribute | undefined
  let sourceCodeLocation: Token.Location | undefined
  let isModule = false
  let isAsync = false
  for (const p of node.attrs) {
    if (p.prefix !== undefined) continue
    if (p.name === 'src') {
      if (!src) {
        src = p
        sourceCodeLocation = node.sourceCodeLocation?.attrs!['src']
      }
    } else if (p.name === 'type' && p.value && p.value === 'module') {
      isModule = true
    } else if (p.name === 'async') {
      isAsync = true
    }
  }
  return { src, sourceCodeLocation, isModule, isAsync }
}

const attrValueStartRE = /=\s*(.)/

export function overwriteAttrValue(
  s: MagicString,
  sourceCodeLocation: Token.Location,
  newValue: string,
): MagicString {
  const srcString = s.slice(
    sourceCodeLocation.startOffset,
    sourceCodeLocation.endOffset,
  )
  const valueStart = srcString.match(attrValueStartRE)
  if (!valueStart) {
    // overwrite attr value can only be called for a well-defined value 只能为明确定义的值调用覆盖 attr 值
    throw new Error(
      `[vite:html] internal error, failed to overwrite attribute value`, // [vite:html] 内部错误，无法覆盖属性值
    )
  }
  const wrapOffset = valueStart[1] === '"' || valueStart[1] === "'" ? 1 : 0
  const valueOffset = valueStart.index! + valueStart[0].length - 1
  s.update(
    sourceCodeLocation.startOffset + valueOffset + wrapOffset,
    sourceCodeLocation.endOffset - wrapOffset,
    newValue,
  )
  return s
}

/**
 * Format parse5 @type {ParserError} to @type {RollupError}
 */
function formatParseError(parserError: ParserError, id: string, html: string) {
  const formattedError = {
    code: parserError.code,
    message: `parse5 error code ${parserError.code}`,
    frame: generateCodeFrame(
      html,
      parserError.startOffset,
      parserError.endOffset,
    ),
    loc: {
      file: id,
      line: parserError.startLine,
      column: parserError.startCol,
    },
  } satisfies RollupError
  return formattedError
}

function handleParseError(
  parserError: ParserError,
  html: string,
  filePath: string,
) {
  switch (parserError.code) {
    case 'missing-doctype':
      // ignore missing DOCTYPE
      return
    case 'abandoned-head-element-child':
      // Accept elements without closing tag in <head>
      return
    case 'duplicate-attribute':
      // Accept duplicate attributes #9566
      // The first attribute is used, browsers silently ignore duplicates
      return
    case 'non-void-html-element-start-tag-with-trailing-solidus':
      // Allow self closing on non-void elements #10439
      return
  }
  const parseError = formatParseError(parserError, filePath, html)
  throw new Error(
    `Unable to parse HTML; ${parseError.message}\n` +
      ` at ${parseError.loc.file}:${parseError.loc.line}:${parseError.loc.column}\n` +
      `${parseError.frame}`,
  )
}

/**
 * Compiles index.html into an entry js module
 */
export function buildHtmlPlugin(config: ResolvedConfig): Plugin {
  const [preHooks, normalHooks, postHooks] = resolveHtmlTransforms(
    config.plugins,
    config.logger,
  )
  preHooks.unshift(injectCspNonceMetaTagHook(config))
  preHooks.unshift(preImportMapHook(config))
  preHooks.push(htmlEnvHook(config))
  postHooks.push(injectNonceAttributeTagHook(config))
  postHooks.push(postImportMapHook())
  const processedHtml = new Map<string, string>()

  const isExcludedUrl = (url: string) =>
    url[0] === '#' || isExternalUrl(url) || isDataUrl(url)

  // Same reason with `htmlInlineProxyPlugin`
  isAsyncScriptMap.set(config, new Map())

  return {
    name: 'vite:build-html',

    async transform(html, id) {
      if (id.endsWith('.html')) {
        id = normalizePath(id)
        const relativeUrlPath = path.posix.relative(config.root, id)
        const publicPath = `/${relativeUrlPath}`
        const publicBase = getBaseInHTML(relativeUrlPath, config)

        const publicToRelative = (filename: string, importer: string) =>
          publicBase + filename
        const toOutputPublicFilePath = (url: string) =>
          toOutputFilePathInHtml(
            url.slice(1),
            'public',
            relativeUrlPath,
            'html',
            config,
            publicToRelative,
          )
        // Determines true start position for the node, either the < character
        // position, or the newline at the end of the previous line's node.
        const nodeStartWithLeadingWhitespace = (
          node: DefaultTreeAdapterMap['node'],
        ) => {
          const startOffset = node.sourceCodeLocation!.startOffset
          if (startOffset === 0) return 0

          // Gets the offset for the start of the line including the
          // newline trailing the previous node
          const lineStartOffset =
            startOffset - node.sourceCodeLocation!.startCol

          // <previous-line-node></previous-line-node>
          // <target-node></target-node>
          //
          // Here we want to target the newline at the end of the previous line
          // as the start position for our target.
          //
          // <previous-node></previous-node>
          // <doubled-up-node></doubled-up-node><target-node></target-node>
          //
          // However, if there is content between our target node start and the
          // previous newline, we cannot strip it out without risking content deletion.
          let isLineEmpty = false
          try {
            const line = s.slice(Math.max(0, lineStartOffset), startOffset)
            isLineEmpty = !line.trim()
          } catch {
            // magic-string may throw if there's some content removed in the sliced string,
            // which we ignore and assume the line is not empty
          }

          return isLineEmpty ? lineStartOffset : startOffset
        }

        // pre-transform
        html = await applyHtmlTransforms(html, preHooks, {
          path: publicPath,
          filename: id,
        })

        let js = ''
        const s = new MagicString(html)
        const scriptUrls: ScriptAssetsUrl[] = []
        const styleUrls: ScriptAssetsUrl[] = []
        let inlineModuleIndex = -1

        let everyScriptIsAsync = true
        let someScriptsAreAsync = false
        let someScriptsAreDefer = false

        const assetUrlsPromises: Promise<void>[] = []

        // for each encountered asset url, rewrite original html so that it
        // references the post-build location, ignoring empty attributes and
        // attributes that directly reference named output.
        const namedOutput = Object.keys(
          config?.build?.rollupOptions?.input || {},
        )
        const processAssetUrl = async (url: string, shouldInline?: boolean) => {
          if (
            url !== '' && // Empty attribute
            !namedOutput.includes(url) && // Direct reference to named output
            !namedOutput.includes(removeLeadingSlash(url)) // Allow for absolute references as named output can't be an absolute path
          ) {
            try {
              return await urlToBuiltUrl(url, id, config, this, shouldInline)
            } catch (e) {
              if (e.code !== 'ENOENT') {
                throw e
              }
            }
          }
          return url
        }

        await traverseHtml(html, id, (node) => {
          if (!nodeIsElement(node)) {
            return
          }

          let shouldRemove = false

          // script tags
          if (node.nodeName === 'script') {
            const { src, sourceCodeLocation, isModule, isAsync } =
              getScriptInfo(node)

            const url = src && src.value
            const isPublicFile = !!(url && checkPublicFile(url, config))
            if (isPublicFile) {
              // referencing public dir url, prefix with base
              overwriteAttrValue(
                s,
                sourceCodeLocation!,
                partialEncodeURIPath(toOutputPublicFilePath(url)),
              )
            }

            if (isModule) {
              inlineModuleIndex++
              if (url && !isExcludedUrl(url) && !isPublicFile) {
                // <script type="module" src="..."/>
                // add it as an import
                js += `\nimport ${JSON.stringify(url)}`
                shouldRemove = true
              } else if (node.childNodes.length) {
                const scriptNode =
                  node.childNodes.pop() as DefaultTreeAdapterMap['textNode']
                const contents = scriptNode.value
                // <script type="module">...</script>
                const filePath = id.replace(normalizePath(config.root), '')
                addToHTMLProxyCache(config, filePath, inlineModuleIndex, {
                  code: contents,
                })
                js += `\nimport "${id}?html-proxy&index=${inlineModuleIndex}.js"`
                shouldRemove = true
              }

              everyScriptIsAsync &&= isAsync
              someScriptsAreAsync ||= isAsync
              someScriptsAreDefer ||= !isAsync
            } else if (url && !isPublicFile) {
              if (!isExcludedUrl(url)) {
                config.logger.warn(
                  `<script src="${url}"> in "${publicPath}" can't be bundled without type="module" attribute`,
                )
              }
            } else if (node.childNodes.length) {
              const scriptNode =
                node.childNodes.pop() as DefaultTreeAdapterMap['textNode']
              scriptUrls.push(
                ...extractImportExpressionFromClassicScript(scriptNode),
              )
            }
          }

          // For asset references in index.html, also generate an import
          // statement for each - this will be handled by the asset plugin
          const assetAttrs = assetAttrsConfig[node.nodeName]
          if (assetAttrs) {
            for (const p of node.attrs) {
              const attrKey = getAttrKey(p)
              if (p.value && assetAttrs.includes(attrKey)) {
                if (attrKey === 'srcset') {
                  assetUrlsPromises.push(
                    (async () => {
                      const processedEncodedUrl = await processSrcSet(
                        p.value,
                        async ({ url }) => {
                          const decodedUrl = decodeURI(url)
                          if (!isExcludedUrl(decodedUrl)) {
                            const result = await processAssetUrl(url)
                            return result !== decodedUrl
                              ? encodeURIPath(result)
                              : url
                          }
                          return url
                        },
                      )
                      if (processedEncodedUrl !== p.value) {
                        overwriteAttrValue(
                          s,
                          getAttrSourceCodeLocation(node, attrKey),
                          processedEncodedUrl,
                        )
                      }
                    })(),
                  )
                } else {
                  const url = decodeURI(p.value)
                  if (checkPublicFile(url, config)) {
                    overwriteAttrValue(
                      s,
                      getAttrSourceCodeLocation(node, attrKey),
                      partialEncodeURIPath(toOutputPublicFilePath(url)),
                    )
                  } else if (!isExcludedUrl(url)) {
                    if (
                      node.nodeName === 'link' &&
                      isCSSRequest(url) &&
                      // should not be converted if following attributes are present (#6748)
                      !node.attrs.some(
                        (p) =>
                          p.prefix === undefined &&
                          (p.name === 'media' || p.name === 'disabled'),
                      )
                    ) {
                      // CSS references, convert to import
                      const importExpression = `\nimport ${JSON.stringify(url)}`
                      styleUrls.push({
                        url,
                        start: nodeStartWithLeadingWhitespace(node),
                        end: node.sourceCodeLocation!.endOffset,
                      })
                      js += importExpression
                    } else {
                      // If the node is a link, check if it can be inlined. If not, set `shouldInline`
                      // to `false` to force no inline. If `undefined`, it leaves to the default heuristics.
                      const isNoInlineLink =
                        node.nodeName === 'link' &&
                        node.attrs.some(
                          (p) =>
                            p.name === 'rel' &&
                            parseRelAttr(p.value).some((v) =>
                              noInlineLinkRels.has(v),
                            ),
                        )
                      const shouldInline = isNoInlineLink ? false : undefined
                      assetUrlsPromises.push(
                        (async () => {
                          const processedUrl = await processAssetUrl(
                            url,
                            shouldInline,
                          )
                          if (processedUrl !== url) {
                            overwriteAttrValue(
                              s,
                              getAttrSourceCodeLocation(node, attrKey),
                              partialEncodeURIPath(processedUrl),
                            )
                          }
                        })(),
                      )
                    }
                  }
                }
              }
            }
          }

          const inlineStyle = findNeedTransformStyleAttribute(node)
          if (inlineStyle) {
            inlineModuleIndex++
            // replace `inline style` with __VITE_INLINE_CSS__**_**__
            // and import css in js code
            const code = inlineStyle.attr.value
            const filePath = id.replace(normalizePath(config.root), '')
            addToHTMLProxyCache(config, filePath, inlineModuleIndex, { code })
            // will transform with css plugin and cache result with css-post plugin
            js += `\nimport "${id}?html-proxy&inline-css&style-attr&index=${inlineModuleIndex}.css"`
            const hash = getHash(cleanUrl(id))
            // will transform in `applyHtmlTransforms`
            overwriteAttrValue(
              s,
              inlineStyle.location!,
              `__VITE_INLINE_CSS__${hash}_${inlineModuleIndex}__`,
            )
          }

          // <style>...</style>
          if (node.nodeName === 'style' && node.childNodes.length) {
            const styleNode =
              node.childNodes.pop() as DefaultTreeAdapterMap['textNode']
            const filePath = id.replace(normalizePath(config.root), '')
            inlineModuleIndex++
            addToHTMLProxyCache(config, filePath, inlineModuleIndex, {
              code: styleNode.value,
            })
            js += `\nimport "${id}?html-proxy&inline-css&index=${inlineModuleIndex}.css"`
            const hash = getHash(cleanUrl(id))
            // will transform in `applyHtmlTransforms`
            s.update(
              styleNode.sourceCodeLocation!.startOffset,
              styleNode.sourceCodeLocation!.endOffset,
              `__VITE_INLINE_CSS__${hash}_${inlineModuleIndex}__`,
            )
          }

          if (shouldRemove) {
            // remove the script tag from the html. we are going to inject new
            // ones in the end.
            s.remove(
              nodeStartWithLeadingWhitespace(node),
              node.sourceCodeLocation!.endOffset,
            )
          }
        })

        isAsyncScriptMap.get(config)!.set(id, everyScriptIsAsync)

        if (someScriptsAreAsync && someScriptsAreDefer) {
          config.logger.warn(
            `\nMixed async and defer script modules in ${id}, output script will fallback to defer. Every script, including inline ones, need to be marked as async for your output script to be async.`,
          )
        }

        await Promise.all(assetUrlsPromises)

        // emit <script>import("./aaa")</script> asset
        for (const { start, end, url } of scriptUrls) {
          if (checkPublicFile(url, config)) {
            s.update(
              start,
              end,
              partialEncodeURIPath(toOutputPublicFilePath(url)),
            )
          } else if (!isExcludedUrl(url)) {
            s.update(
              start,
              end,
              partialEncodeURIPath(await urlToBuiltUrl(url, id, config, this)),
            )
          }
        }

        // ignore <link rel="stylesheet"> if its url can't be resolved
        const resolvedStyleUrls = await Promise.all(
          styleUrls.map(async (styleUrl) => ({
            ...styleUrl,
            resolved: await this.resolve(styleUrl.url, id),
          })),
        )
        for (const { start, end, url, resolved } of resolvedStyleUrls) {
          if (resolved == null) {
            config.logger.warnOnce(
              `\n${url} doesn't exist at build time, it will remain unchanged to be resolved at runtime`,
            )
            const importExpression = `\nimport ${JSON.stringify(url)}`
            js = js.replace(importExpression, '')
          } else {
            s.remove(start, end)
          }
        }

        processedHtml.set(id, s.toString())

        // inject module preload polyfill only when configured and needed
        const { modulePreload } = config.build
        if (
          modulePreload !== false &&
          modulePreload.polyfill &&
          (someScriptsAreAsync || someScriptsAreDefer)
        ) {
          js = `import "${modulePreloadPolyfillId}";\n${js}`
        }

        // Force rollup to keep this module from being shared between other entry points.
        // If the resulting chunk is empty, it will be removed in generateBundle.
        return { code: js, moduleSideEffects: 'no-treeshake' }
      }
    },

    async generateBundle(options, bundle) {
      const analyzedChunk: Map<OutputChunk, number> = new Map()
      const inlineEntryChunk = new Set<string>()
      const getImportedChunks = (
        chunk: OutputChunk,
        seen: Set<string> = new Set(),
      ): OutputChunk[] => {
        const chunks: OutputChunk[] = []
        chunk.imports.forEach((file) => {
          const importee = bundle[file]
          if (importee?.type === 'chunk' && !seen.has(file)) {
            seen.add(file)

            // post-order traversal
            chunks.push(...getImportedChunks(importee, seen))
            chunks.push(importee)
          }
        })
        return chunks
      }

      const toScriptTag = (
        chunk: OutputChunk,
        toOutputPath: (filename: string) => string,
        isAsync: boolean,
      ): HtmlTagDescriptor => ({
        tag: 'script',
        attrs: {
          ...(isAsync ? { async: true } : {}),
          type: 'module',
          // crossorigin must be set not only for serving assets in a different origin
          // but also to make it possible to preload the script using `<link rel="preload">`.
          // `<script type="module">` used to fetch the script with credential mode `omit`,
          // however `crossorigin` attribute cannot specify that value.
          // https://developer.chrome.com/blog/modulepreload/#ok-so-why-doesnt-link-relpreload-work-for-modules:~:text=For%20%3Cscript%3E,of%20other%20modules.
          // Now `<script type="module">` uses `same origin`: https://github.com/whatwg/html/pull/3656#:~:text=Module%20scripts%20are%20always%20fetched%20with%20credentials%20mode%20%22same%2Dorigin%22%20by%20default%20and%20can%20no%20longer%0Ause%20%22omit%22
          crossorigin: true,
          src: toOutputPath(chunk.fileName),
        },
      })

      const toPreloadTag = (
        filename: string,
        toOutputPath: (filename: string) => string,
      ): HtmlTagDescriptor => ({
        tag: 'link',
        attrs: {
          rel: 'modulepreload',
          crossorigin: true,
          href: toOutputPath(filename),
        },
      })

      const getCssTagsForChunk = (
        chunk: OutputChunk,
        toOutputPath: (filename: string) => string,
        seen: Set<string> = new Set(),
      ): HtmlTagDescriptor[] => {
        const tags: HtmlTagDescriptor[] = []
        if (!analyzedChunk.has(chunk)) {
          analyzedChunk.set(chunk, 1)
          chunk.imports.forEach((file) => {
            const importee = bundle[file]
            if (importee?.type === 'chunk') {
              tags.push(...getCssTagsForChunk(importee, toOutputPath, seen))
            }
          })
        }

        chunk.viteMetadata!.importedCss.forEach((file) => {
          if (!seen.has(file)) {
            seen.add(file)
            tags.push({
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                crossorigin: true,
                href: toOutputPath(file),
              },
            })
          }
        })

        return tags
      }

      for (const [normalizedId, html] of processedHtml) {
        const relativeUrlPath = path.posix.relative(config.root, normalizedId)
        const assetsBase = getBaseInHTML(relativeUrlPath, config)
        const toOutputFilePath = (
          filename: string,
          type: 'asset' | 'public',
        ) => {
          if (isExternalUrl(filename)) {
            return filename
          } else {
            return toOutputFilePathInHtml(
              filename,
              type,
              relativeUrlPath,
              'html',
              config,
              (filename: string, importer: string) => assetsBase + filename,
            )
          }
        }

        const toOutputAssetFilePath = (filename: string) =>
          toOutputFilePath(filename, 'asset')

        const toOutputPublicAssetFilePath = (filename: string) =>
          toOutputFilePath(filename, 'public')

        const isAsync = isAsyncScriptMap.get(config)!.get(normalizedId)!

        let result = html

        // find corresponding entry chunk
        const chunk = Object.values(bundle).find(
          (chunk) =>
            chunk.type === 'chunk' &&
            chunk.isEntry &&
            chunk.facadeModuleId &&
            normalizePath(chunk.facadeModuleId) === normalizedId,
        ) as OutputChunk | undefined

        let canInlineEntry = false

        // inject chunk asset links
        if (chunk) {
          // an entry chunk can be inlined if
          //  - it's an ES module (e.g. not generated by the legacy plugin)
          //  - it contains no meaningful code other than import statements
          if (options.format === 'es' && isEntirelyImport(chunk.code)) {
            canInlineEntry = true
          }

          // when not inlined, inject <script> for entry and modulepreload its dependencies
          // when inlined, discard entry chunk and inject <script> for everything in post-order
          const imports = getImportedChunks(chunk)
          let assetTags: HtmlTagDescriptor[]
          if (canInlineEntry) {
            assetTags = imports.map((chunk) =>
              toScriptTag(chunk, toOutputAssetFilePath, isAsync),
            )
          } else {
            assetTags = [toScriptTag(chunk, toOutputAssetFilePath, isAsync)]
            const { modulePreload } = config.build
            if (modulePreload !== false) {
              const resolveDependencies =
                typeof modulePreload === 'object' &&
                modulePreload.resolveDependencies
              const importsFileNames = imports.map((chunk) => chunk.fileName)
              const resolvedDeps = resolveDependencies
                ? resolveDependencies(chunk.fileName, importsFileNames, {
                    hostId: relativeUrlPath,
                    hostType: 'html',
                  })
                : importsFileNames
              assetTags.push(
                ...resolvedDeps.map((i) =>
                  toPreloadTag(i, toOutputAssetFilePath),
                ),
              )
            }
          }
          assetTags.push(...getCssTagsForChunk(chunk, toOutputAssetFilePath))

          result = injectToHead(result, assetTags)
        }

        // inject css link when cssCodeSplit is false
        if (!config.build.cssCodeSplit) {
          const cssChunk = Object.values(bundle).find(
            (chunk) => chunk.type === 'asset' && chunk.name === 'style.css',
          ) as OutputAsset | undefined
          if (cssChunk) {
            result = injectToHead(result, [
              {
                tag: 'link',
                attrs: {
                  rel: 'stylesheet',
                  crossorigin: true,
                  href: toOutputAssetFilePath(cssChunk.fileName),
                },
              },
            ])
          }
        }

        // no use assets plugin because it will emit file
        let match: RegExpExecArray | null
        let s: MagicString | undefined
        inlineCSSRE.lastIndex = 0
        while ((match = inlineCSSRE.exec(result))) {
          s ||= new MagicString(result)
          const { 0: full, 1: scopedName } = match
          const cssTransformedCode = htmlProxyResult.get(scopedName)!
          s.update(match.index, match.index + full.length, cssTransformedCode)
        }
        if (s) {
          result = s.toString()
        }
        result = await applyHtmlTransforms(
          result,
          [...normalHooks, ...postHooks],
          {
            path: '/' + relativeUrlPath,
            filename: normalizedId,
            bundle,
            chunk,
          },
        )
        // resolve asset url references
        result = result.replace(assetUrlRE, (_, fileHash, postfix = '') => {
          const file = this.getFileName(fileHash)
          if (chunk) {
            chunk.viteMetadata!.importedAssets.add(cleanUrl(file))
          }
          return encodeURIPath(toOutputAssetFilePath(file)) + postfix
        })

        result = result.replace(publicAssetUrlRE, (_, fileHash) => {
          const publicAssetPath = toOutputPublicAssetFilePath(
            getPublicAssetFilename(fileHash, config)!,
          )

          return encodeURIPath(
            urlCanParse(publicAssetPath)
              ? publicAssetPath
              : normalizePath(publicAssetPath),
          )
        })

        if (chunk && canInlineEntry) {
          inlineEntryChunk.add(chunk.fileName)
        }

        const shortEmitName = normalizePath(
          path.relative(config.root, normalizedId),
        )
        this.emitFile({
          type: 'asset',
          fileName: shortEmitName,
          source: result,
        })
      }

      for (const fileName of inlineEntryChunk) {
        // all imports from entry have been inlined to html, prevent rollup from outputting it
        delete bundle[fileName]
      }
    },
  }
}

export function parseRelAttr(attr: string): string[] {
  return attr.split(spaceRe).map((v) => v.toLowerCase())
}

// <tag style="... url(...) or image-set(...) ..."></tag> <tag style="... url(...) 或 image-set(...) ..."></tag>
// extract inline styles as virtual css 提取内联样式作为虚拟 css
/**
 * 查找需要转换的 style 属性。
 * 该函数遍历节点的属性，寻找未定义前缀、名称为'style'、且值中包含'url('或'image-set('的属性。
 * 只有当属性满足这些条件时，才会返回该属性及其在源代码中的位置信息。
 */
export function findNeedTransformStyleAttribute(
  node: DefaultTreeAdapterMap['element'],
): { attr: Token.Attribute; location?: Token.Location } | undefined {
  const attr = node.attrs.find(
    (prop) =>
      prop.prefix === undefined &&
      prop.name === 'style' &&
      // only url(...) or image-set(...) in css need to emit file 只有 css 中的 url(...) 或 image-set(...) 需要发出文件
      (prop.value.includes('url(') || prop.value.includes('image-set(')),
  )
  if (!attr) return undefined
  // 尝试获取style属性在源代码中的位置信息
  const location = node.sourceCodeLocation?.attrs?.['style']
  return { attr, location }
}

export function extractImportExpressionFromClassicScript(
  scriptTextNode: DefaultTreeAdapterMap['textNode'],
): ScriptAssetsUrl[] {
  const startOffset = scriptTextNode.sourceCodeLocation!.startOffset
  const cleanCode = stripLiteral(scriptTextNode.value)

  const scriptUrls: ScriptAssetsUrl[] = []
  let match: RegExpExecArray | null
  inlineImportRE.lastIndex = 0
  while ((match = inlineImportRE.exec(cleanCode))) {
    const [, [urlStart, urlEnd]] = match.indices!
    const start = urlStart + 1
    const end = urlEnd - 1
    scriptUrls.push({
      start: start + startOffset,
      end: end + startOffset,
      url: scriptTextNode.value.slice(start, end),
    })
  }
  return scriptUrls
}

export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  children?: string | HtmlTagDescriptor[]
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

export type IndexHtmlTransformResult =
  | string
  | HtmlTagDescriptor[]
  | {
      html: string
      tags: HtmlTagDescriptor[]
    }

export interface IndexHtmlTransformContext {
  /**
   * public path when served
   */
  path: string
  /**
   * filename on disk
   */
  filename: string
  server?: ViteDevServer
  bundle?: OutputBundle
  chunk?: OutputChunk
  originalUrl?: string
}

export type IndexHtmlTransformHook = (
  this: void,
  html: string,
  ctx: IndexHtmlTransformContext,
) => IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>

export type IndexHtmlTransform =
  | IndexHtmlTransformHook
  | {
      order?: 'pre' | 'post' | null
      /**
       * @deprecated renamed to `order`
       */
      enforce?: 'pre' | 'post'
      /**
       * @deprecated renamed to `handler`
       */
      transform: IndexHtmlTransformHook
    }
  | {
      order?: 'pre' | 'post' | null
      /**
       * @deprecated renamed to `order`
       */
      enforce?: 'pre' | 'post'
      handler: IndexHtmlTransformHook
    }

// 定义一个预导入映射钩子函数，用于在HTML中检查`<script type="importmap">`的位置，
// 确保它位于`<script type="module">`和`<link rel="modulepreload">`标签之前。
export function preImportMapHook(
  config: ResolvedConfig,
): IndexHtmlTransformHook {
  return (html, ctx) => {
    const importMapIndex = html.search(importMapRE) // 搜索 <script type="importmap"> 在HTML中的位置
    if (importMapIndex < 0) return // 不存在的话, 返回

    const importMapAppendIndex = html.search(importMapAppendRE)
    if (importMapAppendIndex < 0) return

    if (importMapAppendIndex < importMapIndex) {
      const relativeHtml = normalizePath(
        path.relative(config.root, ctx.filename),
      )
      config.logger.warnOnce(
        colors.yellow(
          colors.bold(
            `(!) <script type="importmap"> should come before <script type="module"> and <link rel="modulepreload"> in /${relativeHtml}`, // (!) <script type="importmap"> 应该位于 <script type="module"> 和 <link rel="modulepreload"> 之前
          ),
        ),
      )
    }
  }
}

/**
 * Move importmap before the first module script and modulepreload link 将 importmap 移至第一个模块脚本和 modulepreload 链接之前
 */
export function postImportMapHook(): IndexHtmlTransformHook {
  return (html) => {
    if (!importMapAppendRE.test(html)) return

    let importMap: string | undefined
    html = html.replace(importMapRE, (match) => {
      importMap = match
      return ''
    })

    if (importMap) {
      html = html.replace(
        importMapAppendRE,
        (match) => `${importMap}\n${match}`,
      )
    }

    return html
  }
}

/**
 * 向HTML中注入CSP（内容安全策略）nonce值的meta标签。
 * CSP nonce可以用于确保页面内的脚本和样式等资源在加载时具有一个随时间变化的令牌，
 * 以此加强内容安全策略，防止XSS等安全威胁。
 *
 * @param config ResolvedConfig 配置对象，包含具体的HTML配置和CSP nonce值。
 * @returns IndexHtmlTransformHook 函数，该函数返回一个操作HTML索引的钩子，
 *          用于在HTML头部注入具有nonce属性的meta标签。
 */
export function injectCspNonceMetaTagHook(
  config: ResolvedConfig,
): IndexHtmlTransformHook {
  return () => {
    if (!config.html?.cspNonce) return

    return [
      {
        tag: 'meta',
        injectTo: 'head',
        // use nonce attribute so that it's hidden 使用 nonce 属性使其隐藏
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce#accessing_nonces_and_nonce_hiding
        attrs: { property: 'csp-nonce', nonce: config.html.cspNonce },
      },
    ]
  }
}

/**
 * Support `%ENV_NAME%` syntax in html files 支持 html 文件中的 `%ENV_NAME%` 语法
 * 生成一个用于在HTML中插入环境变量的 transformIndexHtml 钩子函数。
 */
export function htmlEnvHook(config: ResolvedConfig): IndexHtmlTransformHook {
  const pattern = /%(\S+?)%/g
  const envPrefix = resolveEnvPrefix({ envPrefix: config.envPrefix })
  const env: Record<string, any> = { ...config.env } // 可用的环境变量

  // account for user env defines 用户 env 定义的帐户
  for (const key in config.define) {
    if (key.startsWith(`import.meta.env.`)) {
      const val = config.define[key]
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val)
          env[key.slice(16)] = typeof parsed === 'string' ? parsed : val
        } catch {
          env[key.slice(16)] = val
        }
      } else {
        env[key.slice(16)] = JSON.stringify(val)
      }
    }
  }
  // 返回一个函数，用于替换HTML中的环境变量
  return (html, ctx) => {
    // pattern：匹配 %xxx% 格式 -- 表示为环境变量
    return html.replace(pattern, (text, key) => {
      // 如果匹配到了用户的环境变量, 则替换掉
      if (key in env) {
        return env[key]
      } else {
        // 如果环境变量不存在，且其前缀匹配配置的环境变量前缀，则打印警告
        if (envPrefix.some((prefix) => key.startsWith(prefix))) {
          const relativeHtml = normalizePath(
            path.relative(config.root, ctx.filename),
          )
          config.logger.warn(
            colors.yellow(
              colors.bold(
                `(!) ${text} is not defined in env variables found in /${relativeHtml}. ` + // (!) ${text} 未在 /${relativeHtml} 中找到的环境变量中定义。
                  `Is the variable mistyped?`, // 变量输入错误吗？
              ),
            ),
          )
        }

        return text
      }
    })
  }
}

// 向HTML中的特定标签（script, style, 以及具有特定rel属性的link标签）注入nonce（一次性令牌）属性，
// 以增强内容安全策略（CSP）。
export function injectNonceAttributeTagHook(
  config: ResolvedConfig,
): IndexHtmlTransformHook {
  const processRelType = new Set(['stylesheet', 'modulepreload', 'preload'])

  return async (html, { filename }) => {
    const nonce = config.html?.cspNonce
    if (!nonce) return

    const s = new MagicString(html)

    // 解析 html 为 AST，并遍历
    await traverseHtml(html, filename, (node) => {
      // 不是元素节点，退出
      if (!nodeIsElement(node)) {
        return
      }

      const { nodeName, attrs, sourceCodeLocation } = node

      // 节点为 script、style、link 节点等
      if (
        nodeName === 'script' ||
        nodeName === 'style' ||
        (nodeName === 'link' &&
          attrs.some(
            (attr) =>
              attr.name === 'rel' &&
              parseRelAttr(attr.value).some((a) => processRelType.has(a)),
          ))
      ) {
        // If we already have a nonce attribute, we don't need to add another one 如果我们已经有一个 nonce 属性，则不需要再添加一个
        if (attrs.some(({ name }) => name === 'nonce')) {
          return
        }

        const startTagEndOffset = sourceCodeLocation!.startTag!.endOffset

        // if the closing of the start tag includes a `/`, the offset should be 2 so the nonce 如果开始标记的结尾包含`/`，则偏移量应为 2，因此随机数
        // is appended prior to the `/` 添加到 `/` 之前
        const appendOffset = html[startTagEndOffset - 2] === '/' ? 2 : 1

        s.appendRight(startTagEndOffset - appendOffset, ` nonce="${nonce}"`)
      }
    })

    return s.toString()
  }
}

// 解析并组织插件 transformIndexHtml 钩子。
export function resolveHtmlTransforms(
  plugins: readonly Plugin[],
  logger: Logger,
): [
  IndexHtmlTransformHook[],
  IndexHtmlTransformHook[],
  IndexHtmlTransformHook[],
] {
  const preHooks: IndexHtmlTransformHook[] = [] // 前置插件 transformIndexHtml 钩子处理器
  const normalHooks: IndexHtmlTransformHook[] = [] // 正常插件 transformIndexHtml 钩子处理器
  const postHooks: IndexHtmlTransformHook[] = [] // 后置插件 transformIndexHtml 钩子处理器

  // 遍历插件
  for (const plugin of plugins) {
    const hook = plugin.transformIndexHtml // 提取插件注册的 transformIndexHtml 钩子
    if (!hook) continue

    if (typeof hook === 'function') {
      // 如果是函数,添加至对应集合
      normalHooks.push(hook)
    } else {
      if (!('order' in hook) && 'enforce' in hook) {
        logger.warnOnce(
          colors.yellow(
            `plugin '${plugin.name}' uses deprecated 'enforce' option. Use 'order' option instead.`, // 插件“${plugin.name}”使用已弃用的“enforce”选项。请改用“order”选项。
          ),
        )
      }
      if (!('handler' in hook) && 'transform' in hook) {
        logger.warnOnce(
          colors.yellow(
            `plugin '${plugin.name}' uses deprecated 'transform' option. Use 'handler' option instead.`, // 插件“${plugin.name}”使用已弃用的“transform”选项。使用“handler”选项代替
          ),
        )
      }

      // `enforce` had only two possible values for the `transformIndexHtml` hook “enforce”对于“transformIndexHtml”钩子只有两个可能的值
      // `'pre'` and `'post'` (the default). `order` now works with three values “pre”和“post”（默认值）`order `现在使用三个值
      // to align with other hooks (`'pre'`, normal, and `'post'`). We map 与其他钩子对齐（“re”、“normal”和“post”）。我们绘制地图
      // both `enforce: 'post'` to `order: undefined` to avoid a breaking change 既有“enforce:”post“”也有“order:undefined”，以避免出现中断更改
      const order = hook.order ?? (hook.enforce === 'pre' ? 'pre' : undefined)
      // @ts-expect-error union type
      const handler = hook.handler ?? hook.transform
      if (order === 'pre') {
        preHooks.push(handler)
      } else if (order === 'post') {
        postHooks.push(handler)
      } else {
        normalHooks.push(handler)
      }
    }
  }

  return [preHooks, normalHooks, postHooks]
}

export async function applyHtmlTransforms(
  html: string,
  hooks: IndexHtmlTransformHook[],
  ctx: IndexHtmlTransformContext,
): Promise<string> {
  // 遍历 transformIndexHtml 钩子
  for (const hook of hooks) {
    const res = await hook(html, ctx)
    // 如果没有返回值的话, 进行下一个钩子执行
    if (!res) {
      continue
    }
    // 如果返回字符串的话, 直接使用返回值
    if (typeof res === 'string') {
      html = res
    } else {
      // 需要额外添加的 html 标签
      let tags: HtmlTagDescriptor[]
      if (Array.isArray(res)) {
        tags = res
      } else {
        html = res.html || html // html 内容
        tags = res.tags // 需要额外添加的 html 标签
      }

      let headTags: HtmlTagDescriptor[] | undefined //  在 head 之后添加
      let headPrependTags: HtmlTagDescriptor[] | undefined // 在 head 元素之前添加
      let bodyTags: HtmlTagDescriptor[] | undefined // 在 body 元素末尾添加的标签
      let bodyPrependTags: HtmlTagDescriptor[] | undefined // 在 body 元素之前添加的标签

      for (const tag of tags) {
        switch (tag.injectTo) {
          case 'body':
            ;(bodyTags ??= []).push(tag)
            break
          case 'body-prepend':
            ;(bodyPrependTags ??= []).push(tag)
            break
          case 'head':
            ;(headTags ??= []).push(tag)
            break
          default:
            ;(headPrependTags ??= []).push(tag)
        }
      }

      // 注入到对应位置
      if (headPrependTags) html = injectToHead(html, headPrependTags, true)
      if (headTags) html = injectToHead(html, headTags)
      if (bodyPrependTags) html = injectToBody(html, bodyPrependTags, true)
      if (bodyTags) html = injectToBody(html, bodyTags)
    }
  }

  return html
}

const importRE = /\bimport\s*("[^"]*[^\\]"|'[^']*[^\\]');*/g
const commentRE = /\/\*[\s\S]*?\*\/|\/\/.*$/gm
function isEntirelyImport(code: string) {
  // only consider "side-effect" imports, which match <script type=module> semantics exactly
  // the regexes will remove too little in some exotic cases, but false-negatives are alright
  return !code.replace(importRE, '').replace(commentRE, '').trim().length
}

function getBaseInHTML(urlRelativePath: string, config: ResolvedConfig) {
  // Prefer explicit URL if defined for linking to assets and public files from HTML,
  // even when base relative is specified
  return config.base === './' || config.base === ''
    ? path.posix.join(
        path.posix.relative(urlRelativePath, '').slice(0, -2),
        './',
      )
    : config.base
}

const headInjectRE = /([ \t]*)<\/head>/i
const headPrependInjectRE = /([ \t]*)<head[^>]*>/i

const htmlInjectRE = /<\/html>/i
const htmlPrependInjectRE = /([ \t]*)<html[^>]*>/i

const bodyInjectRE = /([ \t]*)<\/body>/i
const bodyPrependInjectRE = /([ \t]*)<body[^>]*>/i

const doctypePrependInjectRE = /<!doctype html>/i

// 将指定的 HTML 标签注入到 Head 元素中, 根据 preapend 指示注入在头部还是尾部
function injectToHead(
  html: string,
  tags: HtmlTagDescriptor[],
  prepend = false,
) {
  if (tags.length === 0) return html

  if (prepend) {
    // inject as the first element of head 作为 head 的第一个元素注入
    if (headPrependInjectRE.test(html)) {
      return html.replace(
        headPrependInjectRE,
        (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`,
      )
    }
  } else {
    // inject before head close 头部闭合前注射
    if (headInjectRE.test(html)) {
      // respect indentation of head tag 尊重 head 标签的缩进
      return html.replace(
        headInjectRE,
        (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`,
      )
    }
    // try to inject before the body tag 尝试在 body 标签之前注入
    if (bodyPrependInjectRE.test(html)) {
      return html.replace(
        bodyPrependInjectRE,
        (match, p1) => `${serializeTags(tags, p1)}\n${match}`,
      )
    }
  }
  // if no head tag is present, we prepend the tag for both prepend and append 如果不存在 head 标签，我们会在前置和附加中添加该标签
  return prependInjectFallback(html, tags)
}

function injectToBody(
  html: string,
  tags: HtmlTagDescriptor[],
  prepend = false,
) {
  if (tags.length === 0) return html

  if (prepend) {
    // inject after body open
    if (bodyPrependInjectRE.test(html)) {
      return html.replace(
        bodyPrependInjectRE,
        (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`,
      )
    }
    // if no there is no body tag, inject after head or fallback to prepend in html
    if (headInjectRE.test(html)) {
      return html.replace(
        headInjectRE,
        (match, p1) => `${match}\n${serializeTags(tags, p1)}`,
      )
    }
    return prependInjectFallback(html, tags)
  } else {
    // inject before body close
    if (bodyInjectRE.test(html)) {
      return html.replace(
        bodyInjectRE,
        (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`,
      )
    }
    // if no body tag is present, append to the html tag, or at the end of the file
    if (htmlInjectRE.test(html)) {
      return html.replace(htmlInjectRE, `${serializeTags(tags)}\n$&`)
    }
    return html + `\n` + serializeTags(tags)
  }
}

function prependInjectFallback(html: string, tags: HtmlTagDescriptor[]) {
  // prepend to the html tag, append after doctype, or the document start 添加到 html 标签之前，添加到 doctype 之后，或者文档开始处
  if (htmlPrependInjectRE.test(html)) {
    return html.replace(htmlPrependInjectRE, `$&\n${serializeTags(tags)}`)
  }
  if (doctypePrependInjectRE.test(html)) {
    return html.replace(doctypePrependInjectRE, `$&\n${serializeTags(tags)}`)
  }
  return serializeTags(tags) + html
}

const unaryTags = new Set(['link', 'meta', 'base'])

function serializeTag(
  { tag, attrs, children }: HtmlTagDescriptor,
  indent: string = '',
): string {
  if (unaryTags.has(tag)) {
    return `<${tag}${serializeAttrs(attrs)}>`
  } else {
    return `<${tag}${serializeAttrs(attrs)}>${serializeTags(
      children,
      incrementIndent(indent),
    )}</${tag}>`
  }
}

function serializeTags(
  tags: HtmlTagDescriptor['children'],
  indent: string = '',
): string {
  if (typeof tags === 'string') {
    return tags
  } else if (tags && tags.length) {
    return tags.map((tag) => `${indent}${serializeTag(tag, indent)}\n`).join('')
  }
  return ''
}

function serializeAttrs(attrs: HtmlTagDescriptor['attrs']): string {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean') {
      res += attrs[key] ? ` ${key}` : ``
    } else {
      res += ` ${key}=${JSON.stringify(attrs[key])}`
    }
  }
  return res
}

function incrementIndent(indent: string = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`
}

export function getAttrKey(attr: Token.Attribute): string {
  return attr.prefix === undefined ? attr.name : `${attr.prefix}:${attr.name}`
}

function getAttrSourceCodeLocation(
  node: DefaultTreeAdapterMap['element'],
  attrKey: string,
) {
  return node.sourceCodeLocation!.attrs![attrKey]
}

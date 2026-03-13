import type {
  IncomingMessage,
  OutgoingHttpHeaders,
  ServerResponse,
} from 'node:http'
import path from 'node:path'
import convertSourceMap from 'convert-source-map'
import getEtag from 'etag'
import type { SourceMap } from 'rollup'
import MagicString from 'magic-string'
import { createDebugger, removeTimestampQuery } from '../utils'
import { getCodeWithSourcemap } from './sourcemap'

const debug = createDebugger('vite:send', {
  onlyWhenFocused: true,
})

const alias: Record<string, string | undefined> = {
  js: 'text/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json',
}

export interface SendOptions {
  etag?: string
  cacheControl?: string
  headers?: OutgoingHttpHeaders
  map?: SourceMap | { mappings: '' } | null
}

export function send(
  req: IncomingMessage,
  res: ServerResponse,
  content: string | Buffer,
  type: string,
  options: SendOptions,
): void {
  const {
    etag = getEtag(content, { weak: true }), // 如果没有传入 etag，则根据内容生成一个
    cacheControl = 'no-cache',
    headers,
    map,
  } = options

  // 如果响应已结束，则直接返回。
  if (res.writableEnded) {
    return
  }

  // 如果请求的ETag与生成的ETag匹配，则返回304 Not Modified。
  if (req.headers['if-none-match'] === etag) {
    res.statusCode = 304
    res.end()
    return
  }

  // 设置内容类型、缓存控制和ETag头部。
  res.setHeader('Content-Type', alias[type] || type)
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Etag', etag)

  // 如果有自定义头部，则设置它们。
  if (headers) {
    for (const name in headers) {
      res.setHeader(name, headers[name]!)
    }
  }

  // 根据源映射注入代码。
  // inject source map reference 注入源映射参考
  if (map && 'version' in map && map.mappings) {
    if (type === 'js' || type === 'css') {
      content = getCodeWithSourcemap(type, content.toString(), map)
    }
  }
  // inject fallback sourcemap for js for improved debugging
  // https://github.com/vitejs/vite/pull/13514#issuecomment-1592431496
  else if (type === 'js' && (!map || map.mappings !== '')) {
    const code = content.toString()
    // if the code has existing inline sourcemap, assume it's correct and skip
    if (convertSourceMap.mapFileCommentRegex.test(code)) {
      debug?.(`Skipped injecting fallback sourcemap for ${req.url}`)
    } else {
      const urlWithoutTimestamp = removeTimestampQuery(req.url!)
      const ms = new MagicString(code)
      content = getCodeWithSourcemap(
        type,
        code,
        ms.generateMap({
          source: path.basename(urlWithoutTimestamp),
          hires: 'boundary',
          includeContent: true,
        }),
      )
    }
  }

  // 设置状态码为200，并结束响应。
  res.statusCode = 200
  res.end(content)
  return
}

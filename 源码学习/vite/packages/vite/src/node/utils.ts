import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { exec } from 'node:child_process'
import { createHash } from 'node:crypto'
import { URL, fileURLToPath } from 'node:url'
import { builtinModules, createRequire } from 'node:module'
import { promises as dns } from 'node:dns'
import { performance } from 'node:perf_hooks'
import type { AddressInfo, Server } from 'node:net'
import fsp from 'node:fs/promises'
import type { FSWatcher } from 'chokidar'
import remapping from '@ampproject/remapping'
import type { DecodedSourceMap, RawSourceMap } from '@ampproject/remapping'
import colors from 'picocolors'
import debug from 'debug'
import type { Alias, AliasOptions } from 'dep-types/alias'
import type MagicString from 'magic-string'

import type { TransformResult } from 'rollup'
import { createFilter as _createFilter } from '@rollup/pluginutils'
import { cleanUrl, isWindows, slash, withTrailingSlash } from '../shared/utils'
import { VALID_ID_PREFIX } from '../shared/constants'
import {
  CLIENT_ENTRY,
  CLIENT_PUBLIC_PATH,
  ENV_PUBLIC_PATH,
  FS_PREFIX,
  OPTIMIZABLE_ENTRY_RE,
  loopbackHosts,
  wildcardHosts,
} from './constants'
import type { DepOptimizationConfig } from './optimizer'
import type { ResolvedConfig } from './config'
import type { ResolvedServerUrls, ViteDevServer } from './server'
import type { PreviewServer } from './preview'
import {
  type PackageCache,
  findNearestPackageData,
  resolvePackageData,
} from './packages'
import type { CommonServerOptions } from '.'

/**
 * Inlined to keep `@rollup/pluginutils` in devDependencies
 */
export type FilterPattern =
  | ReadonlyArray<string | RegExp>
  | string
  | RegExp
  | null
export const createFilter = _createFilter as (
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: { resolve?: string | false | null },
) => (id: string | unknown) => boolean

const replaceSlashOrColonRE = /[/:]/g
const replaceDotRE = /\./g
const replaceNestedIdRE = /(\s*>\s*)/g
const replaceHashRE = /#/g
export const flattenId = (id: string): string => {
  const flatId = limitFlattenIdLength(
    id
      .replace(replaceSlashOrColonRE, '_')
      .replace(replaceDotRE, '__')
      .replace(replaceNestedIdRE, '___')
      .replace(replaceHashRE, '____'),
  )
  return flatId
}

const FLATTEN_ID_HASH_LENGTH = 8
const FLATTEN_ID_MAX_FILE_LENGTH = 170

const limitFlattenIdLength = (
  id: string,
  limit: number = FLATTEN_ID_MAX_FILE_LENGTH,
): string => {
  if (id.length <= limit) {
    return id
  }
  return id.slice(0, limit - (FLATTEN_ID_HASH_LENGTH + 1)) + '_' + getHash(id)
}

export const normalizeId = (id: string): string =>
  id.replace(replaceNestedIdRE, ' > ')

// Supported by Node, Deno, Bun
const NODE_BUILTIN_NAMESPACE = 'node:'
// Supported by Deno
const NPM_BUILTIN_NAMESPACE = 'npm:'
// Supported by Bun
const BUN_BUILTIN_NAMESPACE = 'bun:'
// Some runtimes like Bun injects namespaced modules here, which is not a node builtin
const nodeBuiltins = builtinModules.filter((id) => !id.includes(':'))

// TODO: Use `isBuiltin` from `node:module`, but Deno doesn't support it
export function isBuiltin(id: string): boolean {
  if (process.versions.deno && id.startsWith(NPM_BUILTIN_NAMESPACE)) return true
  if (process.versions.bun && id.startsWith(BUN_BUILTIN_NAMESPACE)) return true
  return isNodeBuiltin(id)
}

export function isNodeBuiltin(id: string): boolean {
  if (id.startsWith(NODE_BUILTIN_NAMESPACE)) return true
  return nodeBuiltins.includes(id)
}

// 检查给定的字符串是否包含`node_modules`
export function isInNodeModules(id: string): boolean {
  return id.includes('node_modules')
}

export function moduleListContains(
  moduleList: string[] | undefined,
  id: string,
): boolean | undefined {
  return moduleList?.some(
    (m) => m === id || id.startsWith(withTrailingSlash(m)),
  )
}

export function isOptimizable(
  id: string,
  optimizeDeps: DepOptimizationConfig,
): boolean {
  const { extensions } = optimizeDeps
  return (
    OPTIMIZABLE_ENTRY_RE.test(id) ||
    (extensions?.some((ext) => id.endsWith(ext)) ?? false)
  )
}

export const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/
export const deepImportRE = /^([^@][^/]*)\/|^(@[^/]+\/[^/]+)\//

// TODO: use import()
const _require = createRequire(import.meta.url)

export function resolveDependencyVersion(
  dep: string,
  pkgRelativePath = '../../package.json',
): string {
  const pkgPath = path.resolve(_require.resolve(dep), pkgRelativePath)
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version
}

export const rollupVersion = resolveDependencyVersion('rollup')

// set in bin/vite.js
const filter = process.env.VITE_DEBUG_FILTER

const DEBUG = process.env.DEBUG

interface DebuggerOptions {
  onlyWhenFocused?: boolean | string
}

export type ViteDebugScope = `vite:${string}`

// 创建 debugger 调试器：微型 JavaScript 调试实用程序，模仿 Node.js 核心的调试技术
export function createDebugger(
  namespace: ViteDebugScope,
  options: DebuggerOptions = {},
): debug.Debugger['log'] | undefined {
  const log = debug(namespace) // 微型 JavaScript 调试实用程序，模仿 Node.js 核心的调试技术
  const { onlyWhenFocused } = options

  let enabled = log.enabled
  if (enabled && onlyWhenFocused) {
    const ns = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace
    enabled = !!DEBUG?.includes(ns)
  }

  if (enabled) {
    return (...args: [string, ...any[]]) => {
      if (!filter || args.some((a) => a?.includes?.(filter))) {
        log(...args)
      }
    }
  }
}

function testCaseInsensitiveFS() {
  if (!CLIENT_ENTRY.endsWith('client.mjs')) {
    throw new Error(
      `cannot test case insensitive FS, CLIENT_ENTRY const doesn't contain client.mjs`, // 无法测试不区分大小写的 FS，CLIENT_ENTRY const 不包含 client.mjs
    )
  }
  if (!fs.existsSync(CLIENT_ENTRY)) {
    throw new Error(
      'cannot test case insensitive FS, CLIENT_ENTRY does not point to an existing file: ' + // 无法测试不区分大小写的 FS，CLIENT_ENTRY 不指向现有文件：
        CLIENT_ENTRY,
    )
  }
  return fs.existsSync(CLIENT_ENTRY.replace('client.mjs', 'cLiEnT.mjs'))
}

export const urlCanParse =
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  URL.canParse ??
  // URL.canParse is supported from Node.js 18.17.0+, 20.0.0+
  ((path: string, base?: string | undefined): boolean => {
    try {
      new URL(path, base)
      return true
    } catch {
      return false
    }
  })

export const isCaseInsensitiveFS = testCaseInsensitiveFS()

const VOLUME_RE = /^[A-Z]:/i

// 规范化路径
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

export function fsPathFromId(id: string): string {
  const fsPath = normalizePath(
    id.startsWith(FS_PREFIX) ? id.slice(FS_PREFIX.length) : id,
  )
  return fsPath[0] === '/' || VOLUME_RE.test(fsPath) ? fsPath : `/${fsPath}`
}

export function fsPathFromUrl(url: string): string {
  return fsPathFromId(cleanUrl(url))
}

/**
 * Check if dir is a parent of file 检查 dir 是否是文件的父级
 *
 * Warning: parameters are not validated, only works with normalized absolute paths 警告：参数未经验证，仅适用于标准化绝对路径
 *
 * @param dir - normalized absolute path 标准化绝对路径
 * @param file - normalized absolute path 标准化绝对路径
 * @returns true if dir is a parent of file 如果 dir 是文件的父级，则为 true
 */
export function isParentDirectory(dir: string, file: string): boolean {
  dir = withTrailingSlash(dir)
  return (
    file.startsWith(dir) ||
    (isCaseInsensitiveFS && file.toLowerCase().startsWith(dir.toLowerCase()))
  )
}

/**
 * Check if 2 file name are identical
 *
 * Warning: parameters are not validated, only works with normalized absolute paths
 *
 * @param file1 - normalized absolute path
 * @param file2 - normalized absolute path
 * @returns true if both files url are identical
 */
export function isSameFileUri(file1: string, file2: string): boolean {
  return (
    file1 === file2 ||
    (isCaseInsensitiveFS && file1.toLowerCase() === file2.toLowerCase())
  )
}

// 检查是否为 http(https) url
export const externalRE = /^(https?:)?\/\//
export const isExternalUrl = (url: string): boolean => externalRE.test(url)

export const dataUrlRE = /^\s*data:/i
export const isDataUrl = (url: string): boolean => dataUrlRE.test(url)

export const virtualModuleRE = /^virtual-module:.*/
export const virtualModulePrefix = 'virtual-module:'

const knownJsSrcRE =
  /\.(?:[jt]sx?|m[jt]s|vue|marko|svelte|astro|imba|mdx)(?:$|\?)/
// 是否为 js 类型导入(vue 文件也当成 js 处理)

export const isJSRequest = (url: string): boolean => {
  url = cleanUrl(url)
  if (knownJsSrcRE.test(url)) {
    return true
  }
  if (!path.extname(url) && url[url.length - 1] !== '/') {
    return true
  }
  return false
}

const knownTsRE = /\.(?:ts|mts|cts|tsx)(?:$|\?)/
export const isTsRequest = (url: string): boolean => knownTsRE.test(url)

const importQueryRE = /(\?|&)import=?(?:&|$)/
const directRequestRE = /(\?|&)direct=?(?:&|$)/
const internalPrefixes = [
  FS_PREFIX,
  VALID_ID_PREFIX,
  CLIENT_PUBLIC_PATH,
  ENV_PUBLIC_PATH,
]
const InternalPrefixRE = new RegExp(`^(?:${internalPrefixes.join('|')})`)
const trailingSeparatorRE = /[?&]$/
export const isImportRequest = (url: string): boolean => importQueryRE.test(url)
// 检查给定的URL是否为内部请求。
export const isInternalRequest = (url: string): boolean =>
  InternalPrefixRE.test(url)
// 从URL中移除 import= 查询字符串
export function removeImportQuery(url: string): string {
  return url.replace(importQueryRE, '$1').replace(trailingSeparatorRE, '')
}
export function removeDirectQuery(url: string): string {
  return url.replace(directRequestRE, '$1').replace(trailingSeparatorRE, '')
}

export const urlRE = /(\?|&)url(?:&|$)/
export const rawRE = /(\?|&)raw(?:&|$)/
export function removeUrlQuery(url: string): string {
  return url.replace(urlRE, '$1').replace(trailingSeparatorRE, '')
}
export function removeRawQuery(url: string): string {
  return url.replace(rawRE, '$1').replace(trailingSeparatorRE, '')
}

const replacePercentageRE = /%/g
export function injectQuery(url: string, queryToInject: string): string {
  // encode percents for consistent behavior with pathToFileURL 对百分比进行编码以实现与 pathToFileURL 一致的行为
  // see #2614 for details
  const resolvedUrl = new URL(
    url.replace(replacePercentageRE, '%25'),
    'relative:///',
  )
  const { search, hash } = resolvedUrl
  let pathname = cleanUrl(url)
  pathname = isWindows ? slash(pathname) : pathname
  return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ''}${
    hash ?? ''
  }`
}

const timestampRE = /\bt=\d{13}&?\b/
// 从URL中移除时间戳查询参数并返回新的URL。
export function removeTimestampQuery(url: string): string {
  // 替换URL中的时间戳部分为空字符串
  return url.replace(timestampRE, '').replace(trailingSeparatorRE, '')
}

export async function asyncReplace(
  input: string,
  re: RegExp,
  replacer: (match: RegExpExecArray) => string | Promise<string>,
): Promise<string> {
  let match: RegExpExecArray | null
  let remaining = input
  let rewritten = ''
  while ((match = re.exec(remaining))) {
    rewritten += remaining.slice(0, match.index)
    rewritten += await replacer(match)
    remaining = remaining.slice(match.index + match[0].length)
  }
  rewritten += remaining
  return rewritten
}

/**
 * 计算并返回从指定起点开始的经过时间。
 * @param start 起点时间，单位为毫秒。
 * @param subtract 从最终时间中减去的毫秒数，默认为0。
 * @returns 经过时间的字符串表示，根据时间长度不同，返回不同颜色的文本。
 */
export function timeFrom(start: number, subtract = 0): string {
  // 计算当前时间与起点时间的差值，减去指定的减去值
  const time: number | string = performance.now() - start - subtract
  // 将计算得到的时间转换为字符串，保留两位小数，并以"ms"为单位，在末尾填充空格以达到指定长度
  const timeString = (time.toFixed(2) + `ms`).padEnd(5, ' ')
  // 根据时间的长短，返回不同颜色的文本
  if (time < 10) {
    return colors.green(timeString)
  } else if (time < 50) {
    return colors.yellow(timeString)
  } else {
    return colors.red(timeString)
  }
}

/**
 * pretty url for logging.
 */
export function prettifyUrl(url: string, root: string): string {
  url = removeTimestampQuery(url)
  const isAbsoluteFile = url.startsWith(root)
  if (isAbsoluteFile || url.startsWith(FS_PREFIX)) {
    const file = path.posix.relative(
      root,
      isAbsoluteFile ? url : fsPathFromId(url),
    )
    return colors.dim(file)
  } else {
    return colors.dim(url)
  }
}

/**
 * 检查一个值是否为对象类型。
 * @param value 未知类型的值，需要检查是否为对象。
 * @returns 返回一个布尔值，如果该值是对象则为true，否则为false。
 */
export function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value != null
}

// 获取文件的信息：https://nodejs.cn/api/fs.html#fsstatsyncpath-options
export function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist “throwIfNoEntry”是针对文件不存在的情况的性能优化
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {
    // Ignore errors
  }
}

/**
 * 查找指定文件。
 * @param dir 起始查找目录。
 * @param fileNames 需要查找的文件名列表。
 * @returns 找到的第一个文件的完整路径，如果没有找到则返回 undefined。
 */
export function lookupFile(
  dir: string,
  fileNames: string[],
): string | undefined {
  // 在当前目录及其父目录中查找指定的文件
  while (dir) {
    // 遍历文件名列表，尝试在当前目录下找到文件
    for (const fileName of fileNames) {
      const fullPath = path.join(dir, fileName) // 拼接文件的完整路径
      // 尝试获取文件状态，如果是文件则返回路径
      if (tryStatSync(fullPath)?.isFile()) return fullPath
    }
    // 将当前目录设置为其父目录，继续在上一级目录中查找
    const parentDir = path.dirname(dir)
    if (parentDir === dir) return // 如果父目录与当前目录相同，则退出循环

    dir = parentDir
  }
}

// 判断传入的文件路径指定的文件是否是 ESM 文件
export function isFilePathESM(
  filePath: string,
  packageCache?: PackageCache,
): boolean {
  if (/\.m[jt]s$/.test(filePath)) {
    // 如果文件是以 .mts 或 .mjs 结尾，直接返回 true
    return true
  } else if (/\.c[jt]s$/.test(filePath)) {
    // 如果文件是以 .mjs 或 .mts 结尾, 直接返回 false
    return false
  } else {
    // check package.json for type: "module" 检查 package.json 中的 type: "module"
    try {
      const pkg = findNearestPackageData(path.dirname(filePath), packageCache)
      return pkg?.data.type === 'module'
    } catch {
      return false
    }
  }
}

export const splitRE = /\r?\n/g

const range: number = 2

export function pad(source: string, n = 2): string {
  const lines = source.split(splitRE)
  return lines.map((l) => ` `.repeat(n) + l).join(`\n`)
}

type Pos = {
  /** 1-based */
  line: number
  /** 0-based */
  column: number
}

export function posToNumber(source: string, pos: number | Pos): number {
  if (typeof pos === 'number') return pos
  const lines = source.split(splitRE)
  const { line, column } = pos
  let start = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1
  }
  return start + column
}

export function numberToPos(source: string, offset: number | Pos): Pos {
  if (typeof offset !== 'number') return offset
  if (offset > source.length) {
    throw new Error(
      `offset is longer than source length! offset ${offset} > length ${source.length}`,
    )
  }
  const lines = source.split(splitRE)
  let counted = 0
  let line = 0
  let column = 0
  for (; line < lines.length; line++) {
    const lineLength = lines[line].length + 1
    if (counted + lineLength >= offset) {
      column = offset - counted + 1
      break
    }
    counted += lineLength
  }
  return { line: line + 1, column }
}

export function generateCodeFrame(
  source: string,
  start: number | Pos = 0,
  end?: number | Pos,
): string {
  start = Math.max(posToNumber(source, start), 0)
  end = Math.min(
    end !== undefined ? posToNumber(source, end) : start,
    source.length,
  )
  const lines = source.split(splitRE)
  let count = 0
  const res: string[] = []
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue
        const line = j + 1
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`,
        )
        const lineLength = lines[j].length
        if (j === i) {
          // push underline
          const pad = Math.max(start - (count - lineLength), 0)
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start,
          )
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ` + '^'.repeat(length))
          }
          count += lineLength + 1
        }
      }
      break
    }
    count++
  }
  return res.join('\n')
}

export function isFileReadable(filename: string): boolean {
  if (!tryStatSync(filename)) {
    return false
  }

  try {
    // Check if current process has read permission to the file
    fs.accessSync(filename, fs.constants.R_OK)

    return true
  } catch {
    return false
  }
}

const splitFirstDirRE = /(.+?)[\\/](.+)/

/**
 * Delete every file and subdirectory. **The given directory must exist.**
 * Pass an optional `skip` array to preserve files under the root directory.
 */
export function emptyDir(dir: string, skip?: string[]): void {
  const skipInDir: string[] = []
  let nested: Map<string, string[]> | null = null
  if (skip?.length) {
    for (const file of skip) {
      if (path.dirname(file) !== '.') {
        const matched = file.match(splitFirstDirRE)
        if (matched) {
          nested ??= new Map()
          const [, nestedDir, skipPath] = matched
          let nestedSkip = nested.get(nestedDir)
          if (!nestedSkip) {
            nestedSkip = []
            nested.set(nestedDir, nestedSkip)
          }
          if (!nestedSkip.includes(skipPath)) {
            nestedSkip.push(skipPath)
          }
        }
      } else {
        skipInDir.push(file)
      }
    }
  }
  for (const file of fs.readdirSync(dir)) {
    if (skipInDir.includes(file)) {
      continue
    }
    if (nested?.has(file)) {
      emptyDir(path.resolve(dir, file), nested.get(file))
    } else {
      fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
    }
  }
}

export function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    if (srcFile === destDir) {
      continue
    }
    const destFile = path.resolve(destDir, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}

export const ERR_SYMLINK_IN_RECURSIVE_READDIR =
  'ERR_SYMLINK_IN_RECURSIVE_READDIR'
/**
 * 递归地读取给定目录中的所有文件。
 *
 * @param dir 需要读取的目录路径。
 * @returns 返回一个字符串数组，包含目录中所有文件（包括子目录中的文件）的路径。
 */
export async function recursiveReaddir(dir: string): Promise<string[]> {
  // 检测目录是否存在, 不存在直接返回空
  if (!fs.existsSync(dir)) {
    return []
  }
  let dirents: fs.Dirent[] // 目录
  try {
    // 读取目录内容，包括文件类型信息
    dirents = await fsp.readdir(dir, { withFileTypes: true })
  } catch (e) {
    if (e.code === 'EACCES') {
      // Ignore permission errors 忽略权限错误
      return []
    }
    throw e
  }
  // 不支持符号链接
  // isSymbolicLink：如果 <fs.Dirent> 对象描述符号链接，则返回 true。
  if (dirents.some((dirent) => dirent.isSymbolicLink())) {
    const err: any = new Error(
      'Symbolic links are not supported in recursiveReaddir', // recursiveReaddir 不支持符号链接
    )
    err.code = ERR_SYMLINK_IN_RECURSIVE_READDIR
    throw err
  }
  const files = await Promise.all(
    dirents.map((dirent) => {
      // 获取完整路径
      const res = path.resolve(dir, dirent.name) // dirent.name：此 <fs.Dirent> 对象引用的文件名。
      // dirent.isDirectory：如果 <fs.Stats> 对象描述文件系统目录，则返回 true。
      // 如果是目录 ? 递归处理 : 规范路径
      return dirent.isDirectory() ? recursiveReaddir(res) : normalizePath(res)
    }),
  )
  // 拍平
  return files.flat(1)
}

// `fs.realpathSync.native` resolves differently in Windows network drive,
// causing file read errors. skip for now.
// https://github.com/nodejs/node/issues/37737
export let safeRealpathSync = isWindows
  ? windowsSafeRealPathSync
  : fs.realpathSync.native

// Based on https://github.com/larrybahr/windows-network-drive
// MIT License, Copyright (c) 2017 Larry Bahr
const windowsNetworkMap = new Map()
function windowsMappedRealpathSync(path: string) {
  const realPath = fs.realpathSync.native(path)
  if (realPath.startsWith('\\\\')) {
    for (const [network, volume] of windowsNetworkMap) {
      if (realPath.startsWith(network)) return realPath.replace(network, volume)
    }
  }
  return realPath
}
const parseNetUseRE = /^(\w+)? +(\w:) +([^ ]+)\s/
let firstSafeRealPathSyncRun = false

function windowsSafeRealPathSync(path: string): string {
  if (!firstSafeRealPathSyncRun) {
    optimizeSafeRealPathSync()
    firstSafeRealPathSyncRun = true
  }
  return fs.realpathSync(path)
}

function optimizeSafeRealPathSync() {
  // Skip if using Node <18.10 due to MAX_PATH issue: https://github.com/vitejs/vite/issues/12931
  const nodeVersion = process.versions.node.split('.').map(Number)
  if (nodeVersion[0] < 18 || (nodeVersion[0] === 18 && nodeVersion[1] < 10)) {
    safeRealpathSync = fs.realpathSync
    return
  }
  // Check the availability `fs.realpathSync.native`
  // in Windows virtual and RAM disks that bypass the Volume Mount Manager, in programs such as imDisk
  // get the error EISDIR: illegal operation on a directory
  try {
    fs.realpathSync.native(path.resolve('./'))
  } catch (error) {
    if (error.message.includes('EISDIR: illegal operation on a directory')) {
      safeRealpathSync = fs.realpathSync
      return
    }
  }
  exec('net use', (error, stdout) => {
    if (error) return
    const lines = stdout.split('\n')
    // OK           Y:        \\NETWORKA\Foo         Microsoft Windows Network
    // OK           Z:        \\NETWORKA\Bar         Microsoft Windows Network
    for (const line of lines) {
      const m = line.match(parseNetUseRE)
      if (m) windowsNetworkMap.set(m[3], m[2])
    }
    if (windowsNetworkMap.size === 0) {
      safeRealpathSync = fs.realpathSync.native
    } else {
      safeRealpathSync = windowsMappedRealpathSync
    }
  })
}

/**
 * 确保指定的文件被文件系统观察者监视。
 *
 * 此函数的目的是在给定的根目录下，只对那些位于根目录之外且存在的文件进行监视。
 * 它避免了监视不必要的文件，比如那些位于根目录内的文件，或者根本不存在的文件。
 * 使用文件系统观察者（FSWatcher）可以实时监控文件系统的变化，这对于构建工具来说是非常重要的。
 *
 * @param watcher 文件系统观察者实例，用于添加要监视的文件。
 * @param file 要检查是否应该被监视的文件路径，可能是绝对路径或相对路径。
 * @param root 根目录的路径，用于确定文件是否位于根目录之外。
 */
export function ensureWatchedFile(
  watcher: FSWatcher,
  file: string | null,
  root: string,
): void {
  if (
    file &&
    // only need to watch if out of root 只需要注意是否脱离root
    !file.startsWith(withTrailingSlash(root)) &&
    // some rollup plugins use null bytes for private resolved Ids 一些汇总插件使用空字节作为私有解析 ID
    !file.includes('\0') &&
    fs.existsSync(file)
  ) {
    // resolve file to normalized system path 将文件解析为规范化的系统路径
    watcher.add(path.resolve(file))
  }
}

interface ImageCandidate {
  url: string
  descriptor: string
}
const escapedSpaceCharacters = /( |\\t|\\n|\\f|\\r)+/g
const imageSetUrlRE = /^(?:[\w\-]+\(.*?\)|'.*?'|".*?"|\S*)/
function joinSrcset(ret: ImageCandidate[]) {
  return ret
    .map(({ url, descriptor }) => url + (descriptor ? ` ${descriptor}` : ''))
    .join(', ')
}

// NOTE: The returned `url` should perhaps be decoded so all handled URLs within Vite are consistently decoded.
// However, this may also require a refactor for `cssReplacer` to accept decoded URLs instead.
function splitSrcSetDescriptor(srcs: string): ImageCandidate[] {
  return splitSrcSet(srcs)
    .map((s) => {
      const src = s.replace(escapedSpaceCharacters, ' ').trim()
      const url = imageSetUrlRE.exec(src)?.[0] ?? ''

      return {
        url,
        descriptor: src.slice(url.length).trim(),
      }
    })
    .filter(({ url }) => !!url)
}

export function processSrcSet(
  srcs: string,
  replacer: (arg: ImageCandidate) => Promise<string>,
): Promise<string> {
  return Promise.all(
    splitSrcSetDescriptor(srcs).map(async ({ url, descriptor }) => ({
      url: await replacer({ url, descriptor }),
      descriptor,
    })),
  ).then(joinSrcset)
}

export function processSrcSetSync(
  srcs: string,
  replacer: (arg: ImageCandidate) => string,
): string {
  return joinSrcset(
    splitSrcSetDescriptor(srcs).map(({ url, descriptor }) => ({
      url: replacer({ url, descriptor }),
      descriptor,
    })),
  )
}

const cleanSrcSetRE =
  /(?:url|image|gradient|cross-fade)\([^)]*\)|"([^"]|(?<=\\)")*"|'([^']|(?<=\\)')*'|data:\w+\/[\w.+\-]+;base64,[\w+/=]+|\?\S+,/g
function splitSrcSet(srcs: string) {
  const parts: string[] = []
  /**
   * There could be a ',' inside of:
   * - url(data:...)
   * - linear-gradient(...)
   * - "data:..."
   * - data:...
   * - query parameter ?...
   */
  const cleanedSrcs = srcs.replace(cleanSrcSetRE, blankReplacer)
  let startIndex = 0
  let splitIndex: number
  do {
    splitIndex = cleanedSrcs.indexOf(',', startIndex)
    parts.push(
      srcs.slice(startIndex, splitIndex !== -1 ? splitIndex : undefined),
    )
    startIndex = splitIndex + 1
  } while (splitIndex !== -1)
  return parts
}

const windowsDriveRE = /^[A-Z]:/
const replaceWindowsDriveRE = /^([A-Z]):\//
const linuxAbsolutePathRE = /^\/[^/]/
function escapeToLinuxLikePath(path: string) {
  if (windowsDriveRE.test(path)) {
    return path.replace(replaceWindowsDriveRE, '/windows/$1/')
  }
  if (linuxAbsolutePathRE.test(path)) {
    return `/linux${path}`
  }
  return path
}

const revertWindowsDriveRE = /^\/windows\/([A-Z])\//
function unescapeToLinuxLikePath(path: string) {
  if (path.startsWith('/linux/')) {
    return path.slice('/linux'.length)
  }
  if (path.startsWith('/windows/')) {
    return path.replace(revertWindowsDriveRE, '$1:/')
  }
  return path
}

// based on https://github.com/sveltejs/svelte/blob/abf11bb02b2afbd3e4cac509a0f70e318c306364/src/compiler/utils/mapped_code.ts#L221
const nullSourceMap: RawSourceMap = {
  names: [],
  sources: [],
  mappings: '',
  version: 3,
}
export function combineSourcemaps(
  filename: string,
  sourcemapList: Array<DecodedSourceMap | RawSourceMap>,
): RawSourceMap {
  if (
    sourcemapList.length === 0 ||
    sourcemapList.every((m) => m.sources.length === 0)
  ) {
    return { ...nullSourceMap }
  }

  // hack for parse broken with normalized absolute paths on windows (C:/path/to/something).
  // escape them to linux like paths
  // also avoid mutation here to prevent breaking plugin's using cache to generate sourcemaps like vue (see #7442)
  sourcemapList = sourcemapList.map((sourcemap) => {
    const newSourcemaps = { ...sourcemap }
    newSourcemaps.sources = sourcemap.sources.map((source) =>
      source ? escapeToLinuxLikePath(source) : null,
    )
    if (sourcemap.sourceRoot) {
      newSourcemaps.sourceRoot = escapeToLinuxLikePath(sourcemap.sourceRoot)
    }
    return newSourcemaps
  })
  const escapedFilename = escapeToLinuxLikePath(filename)

  // We don't declare type here so we can convert/fake/map as RawSourceMap
  let map //: SourceMap
  let mapIndex = 1
  const useArrayInterface =
    sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === undefined
  if (useArrayInterface) {
    map = remapping(sourcemapList, () => null)
  } else {
    map = remapping(sourcemapList[0], function loader(sourcefile) {
      if (sourcefile === escapedFilename && sourcemapList[mapIndex]) {
        return sourcemapList[mapIndex++]
      } else {
        return null
      }
    })
  }
  if (!map.file) {
    delete map.file
  }

  // unescape the previous hack
  map.sources = map.sources.map((source) =>
    source ? unescapeToLinuxLikePath(source) : source,
  )
  map.file = filename

  return map as RawSourceMap
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * Returns resolved localhost address when `dns.lookup` result differs from DNS 当“dns.lookup”结果与dns不同时，返回解析的本地主机地址
 *
 * `dns.lookup` result is same when defaultResultOrder is `verbatim`. 当defaultResultOrder为“逐字逐句”时，“dns.lookup”结果相同。
 * Even if defaultResultOrder is `ipv4first`, `dns.lookup` result maybe same. 即使defaultResultOrder是“ipv4first”，“dns.lookup”的结果也可能相同。
 * For example, when IPv6 is not supported on that machine/network. 例如，当该计算机/网络不支持IPv6时。
 */
export async function getLocalhostAddressIfDiffersFromDNS(): Promise<
  string | undefined
> {
  const [nodeResult, dnsResult] = await Promise.all([
    dns.lookup('localhost'),
    dns.lookup('localhost', { verbatim: true }),
  ])
  const isSame =
    nodeResult.family === dnsResult.family &&
    nodeResult.address === dnsResult.address
  return isSame ? undefined : nodeResult.address
}

export function diffDnsOrderChange(
  oldUrls: ViteDevServer['resolvedUrls'],
  newUrls: ViteDevServer['resolvedUrls'],
): boolean {
  return !(
    oldUrls === newUrls ||
    (oldUrls &&
      newUrls &&
      arrayEqual(oldUrls.local, newUrls.local) &&
      arrayEqual(oldUrls.network, newUrls.network))
  )
}

export interface Hostname {
  /** undefined sets the default behaviour of server.listen */
  host: string | undefined
  /** resolve to localhost when possible */
  name: string
}

/**
 * 解析并返回主机名。
 *
 * @param optionsHost - 可以是字符串、布尔值或未定义。字符串指定主机名，布尔值用于控制默认行为：
 *                      如果为 `undefined` 或 `false`，则使用安全默认值 `localhost`；
 *                      如果为 `true`，则主机名设为 `undefined`，意味着监听所有IP地址。
 * @returns 返回一个 Promise，解析为一个包含 `host` 和 `name` 属性的对象。`host` 是输入的主机名，
 *          而 `name` 是经过处理的主机名，可能被重定向为本地主机地址。
 */
export async function resolveHostname(
  optionsHost: string | boolean | undefined,
): Promise<Hostname> {
  let host: string | undefined
  // 根据 optionsHost 的值设置 host
  if (optionsHost === undefined || optionsHost === false) {
    // Use a secure default 使用安全默认值
    host = 'localhost'
  } else if (optionsHost === true) {
    // If passed --host in the CLI without arguments 如果在 CLI 中传递 --host 且不带参数
    host = undefined // undefined typically means 0.0.0.0 or :: (listen on all IPs) 未定义通常意味着 0.0.0.0 或 ::（监听所有 IP）
  } else {
    host = optionsHost // 直接使用 optionsHost 的值
  }

  // Set host name to localhost when possible 尽可能将主机名设置为 localhost
  let name = host === undefined || wildcardHosts.has(host) ? 'localhost' : host

  // 当主机名设置为 localhost 时，检查是否有与 DNS 不同的本地主机地址
  if (host === 'localhost') {
    // See #8647 for more details.
    const localhostAddr = await getLocalhostAddressIfDiffersFromDNS()
    if (localhostAddr) {
      name = localhostAddr
    }
  }

  return { host, name }
}

/**
 * 解析服务器URLs
 *
 * 此异步函数根据提供的服务器信息、选项和配置，解析出本地和网络的服务器URL列表。
 *
 * @param server 服务器对象，用于获取服务器地址信息。
 * @param options 服务器的通用选项，包括是否使用HTTPS。
 * @param config 解析后的配置对象，提供基础路径等配置信息。
 * @returns 返回一个Promise，解析为一个对象，包含本地（local）和网络（network）的URL数组。
 */
export async function resolveServerUrls(
  server: Server,
  options: CommonServerOptions,
  config: ResolvedConfig,
): Promise<ResolvedServerUrls> {
  // 获取服务器地址信息
  const address = server.address()

  // 判断地址信息是否完整
  const isAddressInfo = (x: any): x is AddressInfo => x?.address
  if (!isAddressInfo(address)) {
    return { local: [], network: [] }
  }

  // 初始化本地和网络URL数组
  const local: string[] = []
  const network: string[] = []
  // 解析主机名
  const hostname = await resolveHostname(options.host)
  // 确定协议类型
  const protocol = options.https ? 'https' : 'http'
  // 获取端口号
  const port = address.port
  // 确定基础路径
  const base =
    config.rawBase === './' || config.rawBase === '' ? '/' : config.rawBase

  // 处理具有明确主机名的情况
  if (hostname.host !== undefined && !wildcardHosts.has(hostname.host)) {
    let hostnameName = hostname.name // 例如: localhost
    // ipv6 host 处理IPv6主机名
    if (hostnameName.includes(':')) {
      hostnameName = `[${hostnameName}]`
    }
    const address = `${protocol}://${hostnameName}:${port}${base}` // 'http://localhost:5173/'
    // 根据主机名判断是添加到本地还是网络URL列表
    if (loopbackHosts.has(hostname.host)) {
      local.push(address)
    } else {
      network.push(address)
    }
  } else {
    // 处理无明确主机名，使用网络接口地址的情况
    Object.values(os.networkInterfaces())
      .flatMap((nInterface) => nInterface ?? [])
      .filter(
        (detail) =>
          detail &&
          detail.address &&
          (detail.family === 'IPv4' ||
            // @ts-expect-error Node 18.0 - 18.3 returns number
            detail.family === 4),
      )
      .forEach((detail) => {
        let host = detail.address.replace('127.0.0.1', hostname.name)
        // ipv6 host
        if (host.includes(':')) {
          host = `[${host}]`
        }
        const url = `${protocol}://${host}:${port}${base}`
        if (detail.address.includes('127.0.0.1')) {
          local.push(url)
        } else {
          network.push(url)
        }
      })
  }
  // 返回解析出的本地和网络URL列表
  return { local, network }
}

/**
 * 将输入的目标转换为数组形式。
 * 如果目标已经是数组，则直接返回该数组；
 * 如果目标不是数组，则将其封装成一个单元素数组返回。
 * @param target 输入的目标，可以是任意类型T，或者是T类型的数组。
 * @returns 返回一个T类型的数组。
 */
export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target]
}

// Taken from https://stackoverflow.com/a/36328890
export const multilineCommentsRE = /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g
export const singlelineCommentsRE = /\/\/.*/g
export const requestQuerySplitRE = /\?(?!.*[/|}])/
export const requestQueryMaybeEscapedSplitRE = /\\?\?(?!.*[/|}])/

export const blankReplacer = (match: string): string => ' '.repeat(match.length)

// 根据内容获取 hash 值
export function getHash(text: Buffer | string, length = 8): string {
  const h = createHash('sha256').update(text).digest('hex').substring(0, length)
  if (length <= 64) return h
  return h.padEnd(length, '_')
}

const _dirname = path.dirname(fileURLToPath(import.meta.url))

export const requireResolveFromRootWithFallback = (
  root: string,
  id: string,
): string => {
  // check existence first, so if the package is not found,
  // it won't be cached by nodejs, since there isn't a way to invalidate them:
  // https://github.com/nodejs/node/issues/44663
  const found = resolvePackageData(id, root) || resolvePackageData(id, _dirname)
  if (!found) {
    const error = new Error(`${JSON.stringify(id)} not found.`)
    ;(error as any).code = 'MODULE_NOT_FOUND'
    throw error
  }

  // actually resolve
  // Search in the root directory first, and fallback to the default require paths.
  return _require.resolve(id, { paths: [root, _dirname] })
}

export function emptyCssComments(raw: string): string {
  return raw.replace(multilineCommentsRE, blankReplacer)
}

function backwardCompatibleWorkerPlugins(plugins: any) {
  if (Array.isArray(plugins)) {
    return plugins
  }
  if (typeof plugins === 'function') {
    return plugins()
  }
  return []
}

/** 递归的合并配置项 */
function mergeConfigRecursively(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  rootPath: string,
) {
  const merged: Record<string, any> = { ...defaults }
  for (const key in overrides) {
    const value = overrides[key]
    if (value == null) {
      continue
    }

    const existing = merged[key]

    if (existing == null) {
      merged[key] = value
      continue
    }

    // fields that require special handling
    if (key === 'alias' && (rootPath === 'resolve' || rootPath === '')) {
      merged[key] = mergeAlias(existing, value)
      continue
    } else if (key === 'assetsInclude' && rootPath === '') {
      merged[key] = [].concat(existing, value)
      continue
    } else if (
      key === 'noExternal' &&
      rootPath === 'ssr' &&
      (existing === true || value === true)
    ) {
      merged[key] = true
      continue
    } else if (key === 'plugins' && rootPath === 'worker') {
      merged[key] = () => [
        ...backwardCompatibleWorkerPlugins(existing),
        ...backwardCompatibleWorkerPlugins(value),
      ]
      continue
    }

    if (Array.isArray(existing) || Array.isArray(value)) {
      merged[key] = [...arraify(existing), ...arraify(value)]
      continue
    }
    if (isObject(existing) && isObject(value)) {
      merged[key] = mergeConfigRecursively(
        existing,
        value,
        rootPath ? `${rootPath}.${key}` : key,
      )
      continue
    }

    merged[key] = value
  }
  return merged
}

// 合并配置项
export function mergeConfig<
  D extends Record<string, any>,
  O extends Record<string, any>,
>(
  defaults: D extends Function ? never : D,
  overrides: O extends Function ? never : O,
  isRoot = true,
): Record<string, any> {
  if (typeof defaults === 'function' || typeof overrides === 'function') {
    throw new Error(`Cannot merge config in form of callback`) // 无法以回调的形式合并配置
  }

  return mergeConfigRecursively(defaults, overrides, isRoot ? '' : '.')
}

// 合并 alias
export function mergeAlias(
  a?: AliasOptions,
  b?: AliasOptions,
): AliasOptions | undefined {
  if (!a) return b
  if (!b) return a
  // 如果都是对象的话, 直接合并俩个对象
  if (isObject(a) && isObject(b)) {
    return { ...a, ...b }
  }
  // the order is flipped because the alias is resolved from top-down, 顺序被翻转，因为别名是从上到下解析的，
  // where the later should have higher priority 后者应该具有更高的优先级
  return [...normalizeAlias(b), ...normalizeAlias(a)]
}

// 规范化 alias，组装成 [Alias] 格式 --  https://cn.vitejs.dev/config/shared-options.html#resolve-alias
export function normalizeAlias(o: AliasOptions = []): Alias[] {
  return Array.isArray(o)
    ? o.map(normalizeSingleAlias)
    : Object.keys(o).map((find) =>
        normalizeSingleAlias({
          find,
          replacement: (o as any)[find],
        }),
      )
}

// https://github.com/vitejs/vite/issues/1363
// work around https://github.com/rollup/plugins/issues/759
function normalizeSingleAlias({
  find,
  replacement,
  customResolver,
}: Alias): Alias {
  if (
    typeof find === 'string' &&
    find[find.length - 1] === '/' &&
    replacement[replacement.length - 1] === '/'
  ) {
    find = find.slice(0, find.length - 1)
    replacement = replacement.slice(0, replacement.length - 1)
  }

  const alias: Alias = {
    find,
    replacement,
  }
  if (customResolver) {
    alias.customResolver = customResolver
  }
  return alias
}

/**
 * Transforms transpiled code result where line numbers aren't altered,
 * so we can skip sourcemap generation during dev
 */
export function transformStableResult(
  s: MagicString,
  id: string,
  config: ResolvedConfig,
): TransformResult {
  return {
    code: s.toString(),
    map:
      config.command === 'build' && config.build.sourcemap
        ? s.generateMap({ hires: 'boundary', source: id })
        : null,
  }
}

// 异步的递归处理数据，最终会将 Promise 处理：
// 例如：(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[] -> Plugin[]
export async function asyncFlatten<T>(arr: T[]): Promise<T[]> {
  do {
    arr = (await Promise.all(arr)).flat(Infinity) as any
  } while (arr.some((v: any) => v?.then))
  return arr
}

// strip UTF-8 BOM
export function stripBomTag(content: string): string {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1)
  }

  return content
}

const windowsDrivePathPrefixRE = /^[A-Za-z]:[/\\]/

/**
 * path.isAbsolute also returns true for drive relative paths on windows (e.g. /something)
 * this function returns false for them but true for absolute paths (e.g. C:/something)
 */
export const isNonDriveRelativeAbsolutePath = (p: string): boolean => {
  if (!isWindows) return p[0] === '/'
  return windowsDrivePathPrefixRE.test(p)
}

/**
 * Determine if a file is being requested with the correct case, to ensure
 * consistent behavior between dev and prod and across operating systems.
 */
export function shouldServeFile(filePath: string, root: string): boolean {
  // can skip case check on Linux
  if (!isCaseInsensitiveFS) return true

  return hasCorrectCase(filePath, root)
}

/**
 * Note that we can't use realpath here, because we don't want to follow
 * symlinks.
 */
function hasCorrectCase(file: string, assets: string): boolean {
  if (file === assets) return true

  const parent = path.dirname(file)

  if (fs.readdirSync(parent).includes(path.basename(file))) {
    return hasCorrectCase(parent, assets)
  }

  return false
}

// 拼接两个 URL 片段
export function joinUrlSegments(a: string, b: string): string {
  // 如果任一参数为空，返回非空参数；否则继续处理
  if (!a || !b) {
    return a || b || ''
  }
  // 如果a以斜杠('/')结尾，移除该斜杠
  if (a[a.length - 1] === '/') {
    a = a.substring(0, a.length - 1)
  }
  // 如果b不以斜杠('/')开头，为其添加斜杠
  if (b[0] !== '/') {
    b = '/' + b
  }
  return a + b
}

export function removeLeadingSlash(str: string): string {
  return str[0] === '/' ? str.slice(1) : str
}

export function stripBase(path: string, base: string): string {
  if (path === base) {
    return '/'
  }
  const devBase = withTrailingSlash(base)
  return path.startsWith(devBase) ? path.slice(devBase.length - 1) : path
}

export function arrayEqual(a: any[], b: any[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function evalValue<T = any>(rawValue: string): T {
  const fn = new Function(`
    var console, exports, global, module, process, require
    return (\n${rawValue}\n)
  `)
  return fn()
}

export function getNpmPackageName(importPath: string): string | null {
  const parts = importPath.split('/')
  if (parts[0][0] === '@') {
    if (!parts[1]) return null
    return `${parts[0]}/${parts[1]}`
  } else {
    return parts[0]
  }
}

const escapeRegexRE = /[-/\\^$*+?.()|[\]{}]/g
export function escapeRegex(str: string): string {
  return str.replace(escapeRegexRE, '\\$&')
}

type CommandType = 'install' | 'uninstall' | 'update'
export function getPackageManagerCommand(
  type: CommandType = 'install',
): string {
  const packageManager =
    process.env.npm_config_user_agent?.split(' ')[0].split('/')[0] || 'npm'
  switch (type) {
    case 'install':
      return packageManager === 'npm' ? 'npm install' : `${packageManager} add`
    case 'uninstall':
      return packageManager === 'npm'
        ? 'npm uninstall'
        : `${packageManager} remove`
    case 'update':
      return packageManager === 'yarn'
        ? 'yarn upgrade'
        : `${packageManager} update`
    default:
      throw new TypeError(`Unknown command type: ${type}`)
  }
}

/**
 * 检测是否为开发服务
 */
export function isDevServer(
  server: ViteDevServer | PreviewServer,
): server is ViteDevServer {
  return 'pluginContainer' in server
}

export interface PromiseWithResolvers<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}
// 生成一个带有解析器（resolve和reject）的Promise对象。
export function promiseWithResolvers<T>(): PromiseWithResolvers<T> {
  let resolve: any
  let reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return { promise, resolve, reject }
}

export function createSerialPromiseQueue<T>(): {
  run(f: () => Promise<T>): Promise<T>
} {
  let previousTask: Promise<[unknown, Awaited<T>]> | undefined

  return {
    async run(f) {
      const thisTask = f()
      // wait for both the previous task and this task
      // so that this function resolves in the order this function is called
      const depTasks = Promise.all([previousTask, thisTask])
      previousTask = depTasks

      const [, result] = await depTasks

      // this task was the last one, clear `previousTask` to free up memory
      if (previousTask === depTasks) {
        previousTask = undefined
      }

      return result
    },
  }
}

export function sortObjectKeys<T extends Record<string, any>>(obj: T): T {
  const sorted: Record<string, any> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key]
  }
  return sorted as T
}

export function displayTime(time: number): string {
  // display: {X}ms
  if (time < 1000) {
    return `${time}ms`
  }

  time = time / 1000

  // display: {X}s
  if (time < 60) {
    return `${time.toFixed(2)}s`
  }

  const mins = parseInt((time / 60).toString())
  const seconds = time % 60

  // display: {X}m {Y}s
  return `${mins}m${seconds < 1 ? '' : ` ${seconds.toFixed(0)}s`}`
}

/**
 * Encodes the URI path portion (ignores part after ? or #)
 */
export function encodeURIPath(uri: string): string {
  if (uri.startsWith('data:')) return uri
  const filePath = cleanUrl(uri)
  const postfix = filePath !== uri ? uri.slice(filePath.length) : ''
  return encodeURI(filePath) + postfix
}

/**
 * Like `encodeURIPath`, but only replacing `%` as `%25`. This is useful for environments
 * that can handle un-encoded URIs, where `%` is the only ambiguous character.
 */
export function partialEncodeURIPath(uri: string): string {
  if (uri.startsWith('data:')) return uri
  const filePath = cleanUrl(uri)
  const postfix = filePath !== uri ? uri.slice(filePath.length) : ''
  return filePath.replaceAll('%', '%25') + postfix
}

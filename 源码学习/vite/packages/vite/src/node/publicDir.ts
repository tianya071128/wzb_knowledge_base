import fs from 'node:fs'
import path from 'node:path'
import { cleanUrl, withTrailingSlash } from '../shared/utils'
import type { ResolvedConfig } from './config'
import {
  ERR_SYMLINK_IN_RECURSIVE_READDIR,
  normalizePath,
  recursiveReaddir,
} from './utils'

const publicFilesMap = new WeakMap<ResolvedConfig, Set<string>>()

/**
 * 初始化公共文件
 *
 * 此异步函数用于初始化并返回项目中的公共文件集合。它会读取配置中指定的公共目录，并将所有文件名（相对于公共目录的路径）保存在一个集合中。
 * 如果在读取目录时遇到符号链接错误，则会直接返回 undefined，否则会返回包含所有文件名的集合。
 *
 * @param config - 包含已解析的配置对象，其中必须指定 publicDir 公共目录的路径。
 * @returns 返回一个 Promise，解析为一个 Set<string>，包含所有公共文件的相对路径；如果在处理过程中遇到符号链接错误，则返回 undefined。
 */
export async function initPublicFiles(
  config: ResolvedConfig,
): Promise<Set<string> | undefined> {
  let fileNames: string[]
  try {
    // 尝试递归读取配置中指定的公共目录下的所有文件名。
    fileNames = await recursiveReaddir(config.publicDir)
  } catch (e) {
    // 如果遇到符号链接错误，则直接返回 undefined，否则重新抛出错误。
    if (e.code === ERR_SYMLINK_IN_RECURSIVE_READDIR) {
      return
    }
    throw e
  }
  // 创建一个集合，存储所有公共文件的相对路径
  const publicFiles = new Set(
    fileNames.map((fileName) => fileName.slice(config.publicDir.length)),
  )
  // 将公共文件集合与配置对象关联起来，以供后续使用。
  publicFilesMap.set(config, publicFiles)
  return publicFiles
}

function getPublicFiles(config: ResolvedConfig): Set<string> | undefined {
  return publicFilesMap.get(config)
}

export function checkPublicFile(
  url: string,
  config: ResolvedConfig,
): string | undefined {
  // note if the file is in /public, the resolver would have returned it
  // as-is so it's not going to be a fully resolved path.
  const { publicDir } = config
  if (!publicDir || url[0] !== '/') {
    return
  }

  const fileName = cleanUrl(url)

  // short-circuit if we have an in-memory publicFiles cache
  const publicFiles = getPublicFiles(config)
  if (publicFiles) {
    return publicFiles.has(fileName)
      ? normalizePath(path.join(publicDir, fileName))
      : undefined
  }

  const publicFile = normalizePath(path.join(publicDir, fileName))
  if (!publicFile.startsWith(withTrailingSlash(publicDir))) {
    // can happen if URL starts with '../'
    return
  }

  return fs.existsSync(publicFile) ? publicFile : undefined
}

import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { isFileReadable } from '../utils'

// https://github.com/vitejs/vite/issues/2820#issuecomment-812495079
const ROOT_FILES = [
  // '.git',

  // https://pnpm.io/workspaces/
  'pnpm-workspace.yaml',

  // https://rushjs.io/pages/advanced/config_files/
  // 'rush.json',

  // https://nx.dev/latest/react/getting-started/nx-setup
  // 'workspace.json',
  // 'nx.json',

  // https://github.com/lerna/lerna#lernajson
  'lerna.json',
]

// npm: https://docs.npmjs.com/cli/v7/using-npm/workspaces#installing-workspaces
// yarn: https://classic.yarnpkg.com/en/docs/workspaces/#toc-how-to-use-it
function hasWorkspacePackageJSON(root: string): boolean {
  const path = join(root, 'package.json')
  if (!isFileReadable(path)) {
    return false
  }
  try {
    const content = JSON.parse(fs.readFileSync(path, 'utf-8')) || {}
    return !!content.workspaces
  } catch {
    return false
  }
}

function hasRootFile(root: string): boolean {
  return ROOT_FILES.some((file) => fs.existsSync(join(root, file)))
}

// 判断当前目录下是否存在 package.json 文件
function hasPackageJSON(root: string) {
  const path = join(root, 'package.json')
  return fs.existsSync(path) // 检查是否存在 package.json 文件
}

/**
 * Search up for the nearest `package.json` 搜索最近的“package.json”
 */
export function searchForPackageRoot(current: string, root = current): string {
  if (hasPackageJSON(current)) return current

  const dir = dirname(current)
  // reach the fs root
  if (!dir || dir === current) return root

  return searchForPackageRoot(dir, root) // 递归查找
}

/**
 * Search up for the nearest workspace root 搜索最近的工作区根目录
 * 主要是有些项目是使用 Monorepo 模式, 有着工作区的概念
 * 一个有效的工作空间应符合以下几个条件，否则会默认以 项目 root 目录 作备选方案：
 *  在 package.json 中包含 workspaces 字段
 *     包含以下几种文件之一
 *          lerna.json
 *          pnpm-workspace.yaml
 */
export function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string {
  if (hasRootFile(current)) return current
  if (hasWorkspacePackageJSON(current)) return current

  const dir = dirname(current)
  // reach the fs root
  if (!dir || dir === current) return root

  return searchForWorkspaceRoot(dir, root)
}

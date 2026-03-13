import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { type DotenvPopulateInput, expand } from 'dotenv-expand'
import { arraify, normalizePath, tryStatSync } from './utils'
import type { UserConfig } from './config'

// 根据模式以及模式目录获取环境变量的文件路径，例如：
// [
//   'D:/低代码/project/wzb/源码学习/vite/playground/html/.env',
//   'D:/低代码/project/wzb/源码学习/vite/playground/html/.env.local',
//   'D:/低代码/project/wzb/源码学习/vite/playground/html/.env.development',
//   'D:/低代码/project/wzb/源码学习/vite/playground/html/.env.development.local',
// ]
export function getEnvFilesForMode(mode: string, envDir: string): string[] {
  return [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ].map((file) => normalizePath(path.join(envDir, file)))
}

/**
 * 根据指定模式加载对应 .env 文件，并选择性的将一些变量赋值到 process.env 中。
 *  并且提取出符合 prefixes 开头的变量(通常为 VITE_) 作为暴露给客户端的
 *  https://cn.vitejs.dev/guide/env-and-mode.html#env-files
 */
export function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string> {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` + // 'local' 无法用作模式名称，因为它与冲突
        `the .local postfix for .env files.`, // .env文件的.local后缀
    )
  }
  prefixes = arraify(prefixes)
  const env: Record<string, string> = {} // 需要暴露给客户端的环境变量
  const envFiles = getEnvFilesForMode(mode, envDir) // 环境变量文件路径：`${envDir}/.env`、`${envDir}/.env.local`、`${envDir}/.env.${mode}`、`${envDir}/.env.${mode}.local`

  // Object.fromEntries() 静态方法将键值对列表转换为一个对象。
  // 解析 env 文件环境变量成：
  // {
  //   VITE_FAVICON_URL: '/sprite.svg'
  //   VITE_FOO: 'bar'

  // }
  const parsed = Object.fromEntries(
    // 将环境变量文件扁平化, 并
    envFiles.flatMap((filePath) => {
      if (!tryStatSync(filePath)?.isFile()) return [] // 如果不是文件的话, 返回空数组

      // dotenv.parse：返回一个带有解析后的键和值的对象 -- https://github.com/motdotla/dotenv?tab=readme-ov-file#parsing
      return Object.entries(parse(fs.readFileSync(filePath)))
    }),
  )

  // test NODE_ENV override before expand as otherwise process.env.NODE_ENV would override this 在扩展之前测试 NODE_ENV 覆盖，否则 process.env.NODE_ENV 将覆盖它
  if (parsed.NODE_ENV && process.env.VITE_USER_NODE_ENV === undefined) {
    process.env.VITE_USER_NODE_ENV = parsed.NODE_ENV
  }
  // support BROWSER and BROWSER_ARGS env variables 支持 BROWSER 和 BROWSER_ARGS 环境变量
  if (parsed.BROWSER && process.env.BROWSER === undefined) {
    process.env.BROWSER = parsed.BROWSER
  }
  if (parsed.BROWSER_ARGS && process.env.BROWSER_ARGS === undefined) {
    process.env.BROWSER_ARGS = parsed.BROWSER_ARGS
  }

  // let environment variables use each other. make a copy of `process.env` so that `dotenv-expand` 让环境变量互相使用。复制 `process.env` 以便 `dotenv-expand`
  // doesn't re-assign the expanded values to the global `process.env`. 不会将扩展值重新分配给全局“process.env”。
  const processEnv = { ...process.env } as DotenvPopulateInput
  expand({ parsed, processEnv }) // 扩展

  // only keys that start with prefix are exposed to client 只有以前缀开头的键才会暴露给客户端
  for (const [key, value] of Object.entries(parsed)) {
    // 判断环境变量是否暴露给客户端
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      env[key] = value
    }
  }

  // check if there are actual env variables starting with VITE_* 检查是否存在以 VITE_* 开头的实际环境变量
  // these are typically provided inline and should be prioritized 这些通常是内联提供的，应该优先考虑
  for (const key in process.env) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      env[key] = process.env[key] as string
    }
  }

  return env
}

// 获取 envPrefix 前缀
export function resolveEnvPrefix({
  envPrefix = 'VITE_',
}: UserConfig): string[] {
  envPrefix = arraify(envPrefix)
  if (envPrefix.includes('')) {
    throw new Error(
      `envPrefix option contains value '', which could lead unexpected exposure of sensitive information.`, // envPrefix 选项包含值 ''，这可能导致敏感信息意外暴露
    )
  }
  return envPrefix
}

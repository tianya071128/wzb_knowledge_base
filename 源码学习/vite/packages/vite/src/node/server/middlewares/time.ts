import { performance } from 'node:perf_hooks'
import type { Connect } from 'dep-types/connect'
import { createDebugger, prettifyUrl, timeFrom } from '../../utils'

const logTime = createDebugger('vite:time')

// 创建一个中间件函数，用于记录请求处理的时间。
export function timeMiddleware(root: string): Connect.NextHandleFunction {
  // 创建一个中间件函数，用于测量请求处理时间
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteTimeMiddleware(req, res, next) {
    const start = performance.now() // 记录请求开始处理的时间
    const end = res.end // 获取原始的响应结束函数
    // 重写响应的结束函数，以在结束时记录时间
    res.end = (...args: readonly [any, any?, any?]) => {
      logTime?.(`${timeFrom(start)} ${prettifyUrl(req.url!, root)}`) // 记录处理时间和美化后的URL
      return end.call(res, ...args) // 调用原始的响应结束函数
    }
    next() // 调用下一个中间件
  }
}

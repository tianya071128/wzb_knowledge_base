import type { Connect } from 'dep-types/connect'

export function notFoundMiddleware(): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function vite404Middleware(_, res) {
    res.statusCode = 404
    res.end()
  }
}

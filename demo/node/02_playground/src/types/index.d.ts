// src/types/koa.d.ts
import Koa from 'koa';

declare module 'koa' {
  interface Context {
    /**
     * 成功响应
     * @param data 响应数据（可选）
     * @param message 提示信息（默认 'success'）
     * @param code 状态码（默认 '200'，表示成功）
     */
    success: (data?: any, message?: string, code?: string) => void;

    /**
     * 错误响应
     * @param message 错误提示
     * @param code 错误码（默认 '1000'，表示通用错误）
     * @param data 附加数据（可选）
     */
    error: (message: string, code?: string, data?: any) => void;
  }
}

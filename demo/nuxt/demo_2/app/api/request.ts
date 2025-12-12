// composables/useApi.ts
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';

// 定义通用响应结构
interface ApiResponse<T = any> {
  code: string;
  data: T;
  message: string;
}

/** 封装通用请求方法 */
const request = async <T = any>(
  url: NitroFetchRequest,
  options: NitroFetchOptions<any> = {}
) => {
  const requestFetch = useRequestFetch();
  const {
    public: { apiBase },
  } = useRuntimeConfig();
  try {
    const response = await requestFetch<ApiResponse<T>>(url, {
      baseURL: apiBase,

      ...options,
      onRequest({ request, options }) {
        // 请求前处理
      },
      onRequestError({ request, options, error }) {
        // 请求错误处理
      },
      onResponse({ request, response, options }) {
        // 响应处理
      },
      onResponseError({ request, response, options }) {
        // 响应错误处理
      },
    });

    // 解析响应数据
    if (response.code == '200' || response.code == '0') {
      return response.data as T;
    } else {
      throw new Error(response.message || '请求失败');
    }
  } catch (error) {
    // 统一错误处理
    console.error('API调用失败:', error);
    throw error;
  }
};

export default request;

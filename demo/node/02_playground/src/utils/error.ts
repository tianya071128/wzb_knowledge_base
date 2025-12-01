import { BusinessError } from '.';

/**
 * 统一处理 mongoose 错误
 */
export function handleMongooseError(
  err: any,
  options: {
    /** 字典映射 */
    fieldMap: Record<string, string>;
  }
) {
  const { fieldMap } = options;

  // 处理唯一键错误
  if (err instanceof Error && (err as any).code === 11000) {
    const fields = Object.keys((err as any).keyPattern);
    let fieldName = '';
    for (const field of fields) {
      // 只要找到第一个, 暂不处理组合的
      if (fieldMap[field]) {
        fieldName = fieldMap[field];
        return Promise.reject(new BusinessError(`${fieldName} 已存在`));
      }
    }
  }

  return Promise.reject(err);
}

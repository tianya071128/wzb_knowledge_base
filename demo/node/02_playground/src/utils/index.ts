/**
 * 提取任意枚举的所有原始值（避开反向映射干扰）
 * @param enumObj 目标枚举
 * @returns 枚举原始值数组（类型安全）
 */
export function getEnumAllValues<T extends Record<string, string | number>>(
  enumObj: T
): Array<T[keyof T]> {
  return (
    Object.keys(enumObj)
      // 过滤枚举成员名称（非数字字符串）
      .filter((key) => isNaN(Number(key)))
      // 映射原始值（保持类型一致）
      .map((key) => enumObj[key as keyof T])
  );
}

/**
 * 封装一个统一业务错误, 统一错误码为 10086, 并且名称为 "业务错误 "
 */
export class BusinessError extends Error {
  code: number;
  constructor(message: string) {
    super(message);
    this.code = 10086;
    this.name = 'businessError';
  }
}

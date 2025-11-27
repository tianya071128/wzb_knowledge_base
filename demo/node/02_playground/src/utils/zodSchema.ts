import z from 'zod';

/** 页码通用参数 */
export const listPageCurrent = z
  .int() // 整数
  .min(1) // 最小值
  .optional() // 可选字段
  .nullable() // 允许为 null
  .transform((val) => (val == null ? 1 : val)) // 转换字段
  .default(1); // 兜底字段缺失的情况（与 transform 默认值保持一致）,

/** 一页条数通用参数 */
export const listPageLimit = z
  .int() // 整数
  .min(1) // 最小值
  .optional() // 可选字段
  .nullable() // 允许为 null
  .transform((val) => (val == null ? 10 : val)) // 转换字段
  .default(10);

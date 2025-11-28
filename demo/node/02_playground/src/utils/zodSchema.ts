import { Types } from 'mongoose';
import z from 'zod';

/** 页码通用参数 */
export const listPageCurrentSchema = z
  .int() // 整数
  .min(1) // 最小值
  .optional() // 可选字段
  .nullable() // 允许为 null
  .transform((val) => (val == null ? 1 : val)) // 转换字段
  .default(1); // 兜底字段缺失的情况（与 transform 默认值保持一致）,

/** 一页条数通用参数 */
export const listPageLimitSchema = z
  .int() // 整数
  .min(1) // 最小值
  .optional() // 可选字段
  .nullable() // 允许为 null
  .transform((val) => (val == null ? 10 : val)) // 转换字段
  .default(10);

/** 创建可复用的 ObjectId 验证 Schema */
export const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: '无效的id',
  });

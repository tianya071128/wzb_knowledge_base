import { Types } from 'mongoose';
import z from 'zod';
import { StatusEnum } from './dict';

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

/** 创建可复用的状态验证 Schema */
export const statusSchema = z
  .enum(StatusEnum)
  .optional() // 允许为空
  .nullable() // 允许为 null
  .transform((val) => val ?? StatusEnum.ENABLE)
  .default(StatusEnum.ENABLE);

/** 创建可复用的描述验证 Schema  */
export const generateRemarksSchema = () => {
  return z
    .string()
    .max(1000, '描述不能超过1000个字符')
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? '')
    .default(''); // 默认为空字符串
};

/** 创建可复用的排序验证 Schema */
export const generateSortSchema = () => {
  return z
    .number()
    .min(0, '排序不能小于0')
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? 0)
    .default(0); // 默认排序为0
};

/** 根据枚举生成可复用的验证 Schema */
export const generateEnumSchema = <T extends Record<string, string | number>>(
  enumObj: T,
  options: {
    /**默认值 */
    defaultValue: T[keyof T];
  }
) => {
  const schema = z
    .enum(enumObj)
    .optional() // 允许为空
    .nullable()
    .transform((val) => val ?? options?.defaultValue)
    .default(options.defaultValue as any); // 允许为 null

  return schema;
};

/** 生成字符串可复用的 Schema */
export const generateStringSchema = (options?: {
  /** 默认值 */
  defaultValue?: string;
}) => {
  const schema = z
    .string()
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? options?.defaultValue ?? '')
    .default(options?.defaultValue ?? '');

  return schema;
};

import { Context } from 'koa';
import z from 'zod';
import { DictTypeEnum } from '../../../utils/dict/system';
import { StatusEnum } from '../../../utils/dict';
import DictModel from '../../../models/Dict';

// #region ------------ 定义 请求参数Schema ------------
export const AddDictSchema = z.object({
  /** 字典编码 */
  code: z.string().min(1).max(20),
  /** 字典名称 */
  name: z.string().min(1).max(20),
  /** 字典类型 */
  type: z.enum(DictTypeEnum, '字典类型类型错误'),
  /** 状态 */
  status: z.enum(StatusEnum),
  /** 排序 */
  sort: z.int().min(1),
  /** 描述 */
  remarks: z
    .string()
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? '') // 转换为空字符串
    .default(''), // 默认为空字符串
});

// 从 schema 导出 TypeScript 类型
type AddDictBody = z.infer<typeof AddDictSchema>;
// #endregion

export default async function addDictController(ctx: Context) {
  const params = ctx.request.body as AddDictBody;

  // 检查字典名称和字典编码是否已存在(需区分租户id)
  if (
    await DictModel.exists({
      name: params.name,
      code: params.code,
      tenantId: ctx.state.corpInfo?._id,
    })
  ) {
    ctx.error('字典名称或字典编码已存在');
    return;
  }

  const res = await DictModel.create({
    ...params,
    tenantId: ctx.state.corpInfo?._id,
  });

  ctx.success(res._id);
}

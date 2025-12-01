import { Context } from 'koa';
import z from 'zod';
import DictModel from '../../../models/Dict';
import DictItemModel, { createDictItem } from '../../../models/DictItem';
import { StatusEnum } from '../../../utils/dict';

// #region ------------ 定义 Schema ------------
export const AddDictItemSchema = z.object({
  /** 字典编码 */
  dictCode: z.string(),
  /** 字典项名称 */
  itemText: z.string().max(20),
  /** 字典项编码 */
  itemValue: z.string().max(20),
  /** 字典项排序 */
  sort: z.int().min(1),
  /** 颜色 */
  color: z.string().max(10).optional().nullable().default(''),
  /** 字典项状态 */
  status: z
    .enum(StatusEnum)
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? StatusEnum.ENABLE)
    .default(StatusEnum.ENABLE),
  /** 字典项描述 */
  remarks: z
    .string()
    .max(1000)
    .optional() // 允许为空
    .nullable() // 允许为 null
    .transform((val) => val ?? '') // 转换为空字符串
    .default(''), // 默认为空字符串
});
// 推导类型
export type AddDictItemBody = z.infer<typeof AddDictItemSchema>;
// #endregion

export default async function addDictItemController(ctx: Context) {
  const params = ctx.request.body as AddDictItemBody;

  // 先检查一下字典是否存在
  if (
    !(await DictModel.exists({
      code: params.dictCode,
      tenantId: ctx.state.corpInfo?._id,
    }))
  ) {
    ctx.error('字典不存在');
    return;
  }

  // 存在的话, 插入字典项
  await createDictItem({
    ...params,
    tenantId: ctx.state.corpInfo?._id,
  });

  ctx.success();
}

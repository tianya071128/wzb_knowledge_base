import { Context } from 'koa';
import { AddDictSchema } from './addDictController';
import z from 'zod';
import DictModel from '../../../models/Dict';
import { objectIdSchema } from '../../../utils/zodSchema';

// #region ------------ 定义 Schema ------------
export const editDictSchema = AddDictSchema.extend({
  /** 字典id */
  id: objectIdSchema,
});

// 从 schema 导出 TypeScript 类型
type EditDictBody = z.infer<typeof editDictSchema>;
// #endregion

export default async function editDictController(ctx: Context) {
  const params = ctx.request.body as EditDictBody;

  await DictModel.findByIdAndUpdate(params.id, params);

  ctx.success();
}

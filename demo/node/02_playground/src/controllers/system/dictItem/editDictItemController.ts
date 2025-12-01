import { Context } from 'koa';
import { AddDictItemSchema } from './addDictItemController';
import { objectIdSchema } from '../../../utils/zodSchema';
import z from 'zod';
import DictItemModel, { updateDictItem } from '../../../models/DictItem';

// #region ------------ 定义 Schema ------------
export const EditDictItemSchema = AddDictItemSchema.extend({
  id: objectIdSchema,
});

// 推导类型
type EditDictItemBody = z.infer<typeof EditDictItemSchema>;
// #endregion

export default async function editDictItemController(ctx: Context) {
  //  参数
  const params = ctx.request.body as EditDictItemBody;

  await updateDictItem(params.id, params);

  ctx.success();
}

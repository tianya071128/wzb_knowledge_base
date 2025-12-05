import { Context } from 'koa';
import z from 'zod';
import { objectIdSchema } from '../../../utils/zodSchema';
import { AddRegionSchema } from './addRegionController';
import { editRegion } from '../../../models/Region/operate';

// #region ------------ 定义 Schema ------------
export const EditRegionSchema = AddRegionSchema.extend({
  /** 区域id */
  id: objectIdSchema,
});
// 推导类型
type EditRegionBody = z.infer<typeof EditRegionSchema>;
// #endregion

export default async function editRegionController(ctx: Context) {
  const params = ctx.request.body as EditRegionBody;

  await editRegion(params);

  ctx.success(params);
}

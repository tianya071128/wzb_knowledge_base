import { Context } from 'koa';
import z from 'zod';
import RegionModel from '../../../models/Region/model';
import { transformRegionDataList } from '../../../models/Region/utils';

// #region ------------ 定义 Schem ------------
export const QueryRegionListSchema = z.object({
  /** 父级 id */
  parentId: z.string(),
});
// 推导类型
type GetRegionListBody = z.infer<typeof QueryRegionListSchema>;
// #endregion

export default async function queryRegionListController(ctx: Context) {
  const params = ctx.request.body as GetRegionListBody;

  const res = transformRegionDataList(
    await RegionModel.find({
      parentId: params.parentId,
    })
      .select('-createdAt -updatedAt -__v')
      .sort({
        type: 1,
        sort: 1,
        createdAt: -1,
      })
      .lean()
  );

  ctx.success(res);
}

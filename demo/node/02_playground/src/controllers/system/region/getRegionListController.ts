import { Context } from 'koa';
import z from 'zod';
import { StatusEnum } from '../../../utils/dict';
import { RootFilterQuery } from 'mongoose';
import RegionModel, { RegionType } from '../../../models/Region/model';
import { transformRegionDataList } from '../../../models/Region/utils';

// #region ------------ 创建 Schema ------------
export const GetRegionListSchema = z.object({
  /** 区域编码 */
  code: z.string().optional().nullable(),
  /** 区域名称 */
  name: z.string().optional().nullable(),
  /** 状态 */
  status: z.enum(StatusEnum).optional().nullable(),
  /** 是否只查询根区域 */
  type: z.string().optional().nullable(),
});

export type GetRegionListBody = z.infer<typeof GetRegionListSchema>;
// #endregion

export default async function getRegionListController(ctx: Context) {
  const params = ctx.request.body as GetRegionListBody;

  // #region ------------ 组装筛选条件 ------------
  const queryCondition: RootFilterQuery<RegionType> = {};

  // 区域代码
  if (params.code) {
    queryCondition.code = {
      $regex: params.code, // 模拟查询
      $options: 'i', // 不区分大小写
    };
  }

  // 区域名称
  if (params.name) {
    queryCondition.name = {
      $regex: params.name, // 模拟查询
      $options: 'i', // 不区分大小写
    };
  }

  // 状态
  if (params.status != null) {
    queryCondition.status = params.status;
  }

  // 是否查询根区域
  if (params.type === '1') {
    // paratId 为 null 或者为 "0", 或者不存在该字段, 都满足条件
    queryCondition.parentId = { $in: ['0', null, undefined, ''] };
  }
  // #endregion

  // 执行筛选
  const data = transformRegionDataList(
    await RegionModel.find(queryCondition)
      .select('-createdAt -updatedAt -__v')
      .sort({
        type: 1,
        sort: 1,
        createdAt: -1,
      })
      .lean()
  );

  ctx.success(data);
}

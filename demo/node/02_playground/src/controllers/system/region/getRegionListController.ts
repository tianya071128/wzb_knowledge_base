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
  /** 根据类型查询 */
  type: z.coerce // 转换类型
    .number() // 转换为数字
    .int() // 强制为整数
    .optional()
    .nullable(),
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

  // 区域类型
  if (params.type != null) {
    queryCondition.type = Number(params.type);
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

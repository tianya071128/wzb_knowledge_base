import { Context } from 'koa';
import z from 'zod';
import {
  listPageCurrentSchema,
  listPageLimitSchema,
} from '../../../utils/zodSchema';
import { StatusEnum } from '../../../utils/dict';
import { RootFilterQuery } from 'mongoose';
import DictItemModel, { DictItemType } from '../../../models/DictItem';
import { transformMongooseDataList } from '../../../utils/transform';

// #region ------------ 定义 Schema ------------
export const GetDictItemListPageSchema = z.object({
  current: listPageCurrentSchema,
  limit: listPageLimitSchema,
  /** 字典编码 */
  dictCode: z.string(),
  /** 字典项名称 */
  itemText: z.string().optional().nullable(),
  /** 状态 */
  status: z.enum(StatusEnum).optional().nullable(),
});
// 推导类型
type GetDictItemListPageBody = z.infer<typeof GetDictItemListPageSchema>;
// #endregion

export default async function getDictItemListPageController(ctx: Context) {
  const params = ctx.request.body as GetDictItemListPageBody;

  // 组装筛选条件
  let queryCondition: RootFilterQuery<DictItemType> = {
    dictCode: params.dictCode,
    tenantId: ctx.state.corpInfo?._id,
  };

  // 状态
  if (params.status != null) {
    queryCondition.status = params.status;
  }

  // 字典项名称
  if (params.itemText) {
    queryCondition.itemText = {
      $regex: params.itemText, // 模拟查询
      $options: 'i', // 不区分大小写
    };
  }

  // 执行查询
  const res = await DictItemModel.find(queryCondition)
    .select('-createdAt -updatedAt -tenantId -__v')
    .sort({ sort: 1, createdAt: -1 })
    .skip((params.current - 1) * params.limit)
    .limit(params.limit)
    .lean();

  ctx.success({
    records: transformMongooseDataList(res),
    total: await DictItemModel.countDocuments(queryCondition),
    current: params.current,
    limit: params.limit,
  });
}

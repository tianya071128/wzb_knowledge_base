import { Context, Next } from 'koa';
import z from 'zod';
import {
  listPageCurrentSchema,
  listPageLimitSchema,
} from '../../../utils/zodSchema';
import DictModel, { DictType, transfromDictData } from '../../../models/Dict';
import { RootFilterQuery } from 'mongoose';

// 请求参数Schema
export const GetDictListPageSchema = z.object({
  /** 页码 */
  current: listPageCurrentSchema,
  /** 一页多少条 */
  limit: listPageLimitSchema,
  /** 字典名称搜索 */
  name: z.string().optional().nullable(),
  /** 类型 */
  type: z.int().optional().nullable(),
  /** 字典编号 */
  code: z.string().optional().nullable(),
});
// 从 schema 导出 TypeScript 类型
export type GetDictListPageBody = z.infer<typeof GetDictListPageSchema>;

export default async function getDictListPageController(
  ctx: Context,
  next: Next
) {
  const params = ctx.request.body as GetDictListPageBody;

  // 组装查询条件
  let queryCondition: RootFilterQuery<DictType> = {};
  if (params.name) {
    queryCondition.name = {
      $regex: params.name, // 模拟查询
      $options: 'i', // 不区分大小写
    };
  }
  if (params.type != null) {
    queryCondition.type = params.type;
  }
  if (params.code) {
    queryCondition.code = {
      $regex: params.code, // 模拟查询
      $options: 'i', // 不区分大小写
    };
  }

  // 分页查询数据
  const total = await DictModel.countDocuments({
    ...queryCondition,
    tenantId: ctx.state.corpInfo?._id,
  });
  const res = await DictModel.find({
    ...queryCondition,
    tenantId: ctx.state.corpInfo?._id,
  })
    .select('code createAt name status sort type remarks')
    // 排序
    .sort({
      sort: 1,
      createAt: -1,
    })
    // 跳过多少条
    .skip((params.current - 1) * params.limit)
    // 获取多少条
    .limit(params.limit)
    .lean()
    .exec();

  ctx.success({
    current: params.current,
    records: transfromDictData(res),
    limit: params.limit,
    total,
  });

  await next();
}

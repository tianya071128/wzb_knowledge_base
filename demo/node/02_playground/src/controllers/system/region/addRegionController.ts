import { Context } from 'koa';
import z from 'zod';
import { RegionTypeEnum } from '../../../utils/dict/system';
import {
  generateEnumSchema,
  generateRemarksSchema,
  generateSortSchema,
  generateStringSchema,
  statusSchema,
} from '../../../utils/zodSchema';
import { createRegion } from '../../../models/Region/operate';

// #region ------------ 创建 Schema ------------
export const AddRegionSchema = z.object({
  /** 区域名称 */
  name: z.string(),
  /** 区域编码 */
  code: z.string(),
  /** 父级区域id */
  parentId: generateStringSchema({
    defaultValue: '0',
  }),
  /** 区域状态 */
  status: statusSchema,
  /** 区域类型 */
  type: generateEnumSchema(RegionTypeEnum, {
    defaultValue: RegionTypeEnum.PROVINCE,
  }),
  /** 描述 */
  remarks: generateRemarksSchema(),
  /** 排序 */
  sort: generateSortSchema(),
});
// 推导出类型
export type AddRegionBody = z.infer<typeof AddRegionSchema>;
// #endregion

export default async function addRegionController(ctx: Context) {
  const params = ctx.request.body as AddRegionBody;

  await createRegion(params);

  ctx.success();
}

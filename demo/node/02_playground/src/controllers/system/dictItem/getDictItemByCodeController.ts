import { Context } from 'koa';
import DictItemModel from '../../../models/DictItem';
import { StatusEnum } from '../../../utils/dict';
import { transfromMongooseData } from '../../../utils/transform';

export default async function getDictItemByCodeController(ctx: Context) {
  const { code } = ctx.params;

  const res = await DictItemModel.find({
    dictCode: code,
    status: StatusEnum.ENABLE,
    tenantId: ctx.state.corpInfo?._id.toString(),
  })
    .select('-createdAt -updatedAt -tenantId -__v')
    .sort({
      sort: 1,
      createdAt: -1,
    })
    .lean();

  ctx.success(transfromMongooseData(res));
}

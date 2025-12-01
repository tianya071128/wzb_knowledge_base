import { Context } from 'koa';
import DictItemModel from '../../../models/DictItem';

export default async function deleteDictItemController(ctx: Context) {
  // 获取路径参数中的字典ID
  const { id } = ctx.params;

  await DictItemModel.findByIdAndDelete(id);

  ctx.success();
}

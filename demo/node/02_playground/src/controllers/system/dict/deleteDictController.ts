import { Context } from 'koa';
import DictModel from '../../../models/Dict';

export default async function deleteDictController(ctx: Context) {
  // 获取路径参数中的字典ID
  const { id } = ctx.params;

  await DictModel.findByIdAndDelete(id);

  ctx.success();
}

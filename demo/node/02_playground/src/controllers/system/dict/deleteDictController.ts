import { Context } from 'koa';
import DictModel from '../../../models/Dict';
import mongoose from 'mongoose';
import DictItemModel from '../../../models/DictItem';

export default async function deleteDictController(ctx: Context) {
  // 获取路径参数中的字典ID
  const { id } = ctx.params;

  // 使用事务删除字典和字典项
  const dict = await DictModel.findById(id);
  if (dict) {
    // 删除字典项
    await DictItemModel.deleteMany({
      dictCode: dict.code,
      tenantId: dict.tenantId,
    });
  }

  // 删除字典
  await DictModel.findByIdAndDelete(id);

  ctx.success();
}

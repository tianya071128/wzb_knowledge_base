import { Context } from 'koa';
import DictItemModel from '../../../models/DictItem';
import { StatusEnum } from '../../../utils/dict';

export default async function updateDictItemStatusController(ctx: Context) {
  // 获取路径参数中的字典ID
  const { id } = ctx.params;

  // 根据字典id找到字典项数据
  const dictItem = await DictItemModel.findById(id);

  if (!dictItem) {
    return ctx.error('字典项不存在');
  }

  // 更新状态
  await DictItemModel.findByIdAndUpdate(id, {
    status:
      dictItem.status === StatusEnum.DISABLE
        ? StatusEnum.ENABLE
        : StatusEnum.DISABLE,
  });

  ctx.success();
}

import { Context } from 'koa';
import DictModel from '../../../models/Dict';
import { StatusEnum } from '../../../utils/dict';

export default async function updateStatusController(ctx: Context) {
  // 提取 id
  const { id } = ctx.params;

  // 找到该项的数据
  const data = await DictModel.findById(id);

  // 检查是否存在字典
  if (!data) {
    ctx.error('状态更新失败, 请检查参数!');
    return;
  }

  await DictModel.findByIdAndUpdate(id, {
    status:
      data.status === StatusEnum.DISABLE
        ? StatusEnum.ENABLE
        : StatusEnum.DISABLE,
  });

  ctx.success();
}

import { Context } from 'koa';
import RegionModel from '../../../models/Region/model';
import { StatusEnum } from '../../../utils/dict';

export default async function updateRegionStatusController(ctx: Context) {
  const { id, status } = ctx.params;

  // 验证路由参数是否正确
  if (status !== 'enable' && status !== 'disable') {
    ctx.status = 404;
    return;
  }

  await RegionModel.findByIdAndUpdate(id, {
    status: status === 'enable' ? StatusEnum.ENABLE : StatusEnum.DISABLE,
  });

  ctx.success();
}

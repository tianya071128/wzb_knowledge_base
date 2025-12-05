import { Context } from 'koa';
import { deleteRegion } from '../../../models/Region/operate';

export default async function deleteRegionController(ctx: Context) {
  const { id } = ctx.params;

  await deleteRegion(id);

  ctx.success();
}

import { BusinessError } from '../../utils';
import { handleMongooseError } from '../../utils/error';
import RegionModel, { RegionType } from './model';

// 键映射
const fieldMap: Partial<Record<keyof RegionType, string>> = {
  code: '区域代码',
};
/**
 * 封装创建区域方法, 统一处理错误
 */
export async function createRegion(params: Partial<RegionType>) {
  // 如果存在父级区域, 则找到父级区域的路径信息
  let parentIds = '0';
  if (params.parentId && params.parentId !== '0') {
    const parentRegion = await RegionModel.findById(params.parentId);

    if (!parentRegion) {
      return Promise.reject(new BusinessError('上级区域不存在'));
    }

    parentIds = parentRegion.parentIds + `,${parentRegion._id}`;
  }

  try {
    await RegionModel.create({
      ...params,
      parentId: params.parentId || '0',
      parentIds,
      hasChildren: false,
    });
  } catch (error) {
    return handleMongooseError(error, {
      fieldMap,
    });
  }
}

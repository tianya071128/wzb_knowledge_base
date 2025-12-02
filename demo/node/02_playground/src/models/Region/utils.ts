import { transformMongooseDataList } from '../../utils/transform';

/**
 * 统一转换数据
 */
export function transformRegionDataList<T extends Record<string, any>>(
  data?: T[] | null
) {
  return transformMongooseDataList(data);
}

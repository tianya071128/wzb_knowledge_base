import dayjs from 'dayjs';

/**
 * 转换为数组, 会排除掉 ''、undefined、null
 */
export function transfromArray<T>(data?: T | T[] | null): T[] {
  if (data == null || data === '') return [];

  return Array.isArray(data) ? data : [data];
}

/**
 * 转换数据:
 *  1. 将 _id 转为 id 属性
 *  2. 将 createdAt 转为 createTime 属性, 并且转为
 */
export function transformMongooseData<T extends null>(data: T): T;
export function transformMongooseData<T extends undefined>(data: T): T;
export function transformMongooseData<T extends Record<string, any>>(
  data: T
): Omit<T, '_id' | 'createdAt'>;
export function transformMongooseData(data: any) {
  if (!data) return data;

  const { _id, createdAt, ...rest } = data;

  // 处理 _id
  if (_id) {
    (rest as any).id = _id.toString();
  }

  // 处理 createdAt
  if (createdAt) {
    (rest as any).createTime = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
  }

  return rest;
}

/**
 * 转换数据, 批量转换
 */
export function transformMongooseDataList<T extends Record<string, any>>(
  data?: T[] | null
) {
  return transfromArray(data).map((item) => transformMongooseData(item));
}

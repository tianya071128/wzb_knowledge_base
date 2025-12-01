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
export function transfromMongooseData(
  data?: Record<string, any> | Record<string, any>[] | null
) {
  if (!data) return data;

  const result = transfromArray(data).map((item) => {
    const { _id, createdAt, ...rest } = item;

    // 处理 _id
    if (_id) {
      rest.id = _id.toString();
    }

    // 处理 createdAt
    if (createdAt) {
      rest.createTime = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    }

    return rest;
  });

  return Array.isArray(data) ? result : result[0];
}

import mongoose from 'mongoose';
import { BusinessError, escapeRegExp } from '../../utils';
import { handleMongooseError } from '../../utils/error';
import RegionModel, { RegionType } from './model';
import { transfromArray } from '../../utils/transform';

// 键映射
const fieldMap: Partial<Record<keyof RegionType, string>> = {
  code: '区域代码',
};
/**
 * 封装创建区域方法, 统一处理错误
 */
export async function createRegion(params: Partial<RegionType>) {
  // 如果存在父级区域, 则找到父级区域的路径信息
  let parentIds = '0',
    parentRegion: RegionType | null = null;
  if (params.parentId && params.parentId !== '0') {
    parentRegion = await RegionModel.findById(params.parentId);

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

    // 如果存在父级的话, 父级的 hasChildren 设置为 true
    if (parentRegion && parentRegion.hasChildren !== true) {
      await RegionModel.findByIdAndUpdate(parentRegion._id, {
        hasChildren: true,
      });
    }
  } catch (error) {
    return handleMongooseError(error, {
      fieldMap,
    });
  }
}

/**
 * 封装编辑区域方法
 */
export async function editRegion(params: Partial<RegionType>) {
  // 找到之前的区域数据
  const oldRegion = await RegionModel.findById(params._id ?? params.id);

  // 旧的区域不存在
  if (!oldRegion) {
    return Promise.reject(new BusinessError('区域不存在'));
  }

  // 如果父级区域变化了的话, 那么需要处理路径信息
  let parentIds = oldRegion.parentIds,
    parentRegion: RegionType | null = null;
  if (oldRegion.parentId !== params.parentId) {
    if (params.parentId !== '0') {
      parentRegion = await RegionModel.findById(params.parentId);

      if (!parentRegion) {
        return Promise.reject(new BusinessError('上级区域不存在'));
      }

      // 如果上级区域是当前区域的子级或当前区域, 则不允许修改
      if (
        parentRegion.parentIds.includes(oldRegion._id.toString()) ||
        parentRegion._id.toString() === oldRegion._id.toString()
      ) {
        return Promise.reject(
          new BusinessError('上级区域不能是当前区域的子级或当前区域')
        );
      }

      parentIds = parentRegion.parentIds + `,${parentRegion._id}`;
    }
  }

  const res = await RegionModel.findByIdAndUpdate(
    oldRegion._id,
    {
      ...params,
      parentIds,
    },
    {
      new: true,
    }
  );

  // 如果父级区域改变了, 那么就同时修改子孙区域以及修改父区域的 hasChileRen
  if (res && oldRegion.parentId !== params.parentId) {
    await updateParentsHasChildrenStatus([oldRegion.parentId, res.parentId]);

    // 修改子孙区域的路径
    await updateDescendantParentIds(
      `${oldRegion.parentIds},${res._id?.toString()}`,
      `${parentIds},${res._id?.toString()}`
    );
  }

  return res;
}

/**
 * 封装删除区域方法
 */
export async function deleteRegion(id: string | mongoose.Types.ObjectId) {
  try {
    // 删除区域数据
    const res = await RegionModel.findByIdAndDelete(id);

    if (res) {
      // 同时删除子区域数据
      await deleteRegionChildren(res);

      // 更新父级区域 hasChildren
      await updateParentsHasChildrenStatus(res.parentId);
    }
  } catch (error) {
    return handleMongooseError(error, {
      fieldMap,
    });
  }
}

/**
 * 封装根据被删除数据删除子区域数据
 */
export async function deleteRegionChildren(data: RegionType | RegionType[]) {
  let parentIds = transfromArray(data).map((item) => ',' + item._id.toString());
  // 删除区域数据
  const res = await RegionModel.deleteMany({
    $or: parentIds.map((item) => ({
      parentIds: {
        $regex: escapeRegExp(item),
        $options: 'i', // 忽略大小写
      },
    })),
  });
}

/**
 * 检查并批量更新父级区域的 hasChildren 状态
 */
export async function updateParentsHasChildrenStatus(data: string | string[]) {
  const parentIds = transfromArray(data).filter((id) => id && id !== '0');

  // 检查每个父级是否还有子区域
  for (const parentId of parentIds) {
    const childCount = await RegionModel.countDocuments({
      parentId: parentId,
    });

    // 如果没有子区域，更新 hasChildren 为 false
    await RegionModel.findByIdAndUpdate(parentId, {
      hasChildren: childCount !== 0,
    });
  }
}

/**
 * 修改指定区域的子孙区域的 parentIds
 */
async function updateDescendantParentIds(
  oldParentIds: string,
  newParentIds: string
) {
  await RegionModel.updateMany(
    { parentIds: { $regex: `^${escapeRegExp(oldParentIds)}` } },
    [
      {
        $set: {
          parentIds: {
            $replaceOne: {
              input: '$parentIds',
              find: oldParentIds,
              replacement: newParentIds,
            },
          },
        },
      },
    ]
  );
}

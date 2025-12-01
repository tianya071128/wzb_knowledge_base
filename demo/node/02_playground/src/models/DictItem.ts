import mongoose from 'mongoose';
import { StatusEnum } from '../utils/dict';
import { getEnumAllValues } from '../utils';
import { handleMongooseError } from '../utils/error';

/**
 * 字典项结构类型
 */
export interface DictItemType {
  /** 系统字段 */
  _id: mongoose.Types.ObjectId | string;
  /** 租户id */
  tenantId: string | mongoose.Types.ObjectId;
  /** 对应的字典编码 */
  dictCode: string;
  /** 字典值名称 */
  itemText: string;
  /** 字典值编码 */
  itemValue: string;
  /** 字典项状态 */
  status: StatusEnum;
  /** 字典项排序 */
  sort: number;
  /** 字典项描述 */
  remarks: string;
  /** 颜色 */
  color?: string | null;
  /** 创建时间 */
  createAt: Date;
  /** 更新时间 */
  updateAt: Date;
  /** 虚拟字段 - 转换id */
  id?: string;
  /** 虚拟字段 - 创建时间 */
  createTime?: string;
}

const dictItemSchema = new mongoose.Schema<DictItemType>(
  {
    /** 字典所属的租户id */
    tenantId: {
      type: String,
      required: true,
    },
    /** 字典编码 */
    dictCode: {
      type: String,
      required: true,
      index: true,
    },
    /** 字典项名称 */
    itemText: {
      type: String,
      required: true,
      maxlength: [20, '字典项名称长度不能大于 20 个字符'],
    },
    /** 字典项编码 */
    itemValue: {
      type: String,
      required: true,
      maxlength: [20, '字典项编码长度不能大于 20 个字符'],
    },
    /** 字典状态 */
    status: {
      type: Number,
      required: true,
      enum: getEnumAllValues(StatusEnum),
      default: StatusEnum.ENABLE,
    },
    /** 字典排序 */
    sort: {
      type: Number,
      default: 1,
    },
    /** 字典描述 */
    remarks: {
      type: String,
      default: '',
    },
    /** 颜色 */
    color: {
      type: String,
      maxlength: [10, '颜色长度不能大于 10 个字符'],
      default: '',
    },
  },
  {
    timestamps: true, // 关键：启用自动时间戳
  }
);

// 创建复合唯一索引
dictItemSchema.index(
  { tenantId: 1, dictCode: 1, itemText: 1 },
  { unique: true }
);
dictItemSchema.index(
  { tenantId: 1, dictCode: 1, itemValue: 1 },
  { unique: true }
);

// 定义 Model
const DictItemModel = mongoose.model('DictItem', dictItemSchema);

// 键映射
const fieldMap: Partial<Record<keyof DictItemType, string>> = {
  itemText: '字典值名称',
  itemValue: '字典值编码',
};

/**
 * 封装创建字典项方法, 统一处理错误
 */
export async function createDictItem(params: Partial<DictItemType>) {
  try {
    // 返回字典项数据
    return await DictItemModel.create(params);
  } catch (err) {
    return handleMongooseError(err, {
      fieldMap,
    });
  }
}

/**
 * 封装更新字典项方法, 统一处理错误
 */
export async function updateDictItem(
  id: string,
  params: Partial<DictItemType>
) {
  try {
    // 更新字典项数据
    return await DictItemModel.findByIdAndUpdate(id, params);
  } catch (err) {
    return handleMongooseError(err, {
      fieldMap,
    });
  }
}

export default DictItemModel;

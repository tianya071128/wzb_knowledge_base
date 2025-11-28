import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { DictTypeEnum } from '../utils/dict/system';
import { StatusEnum } from '../utils/dict';
import { getEnumAllValues } from '../utils';

/**
 * 字典结构类型
 */
export interface DictType {
  /** 系统字段 */
  _id: mongoose.Types.ObjectId | string;
  /** 租户id */
  tenantId: string;
  /** 字典名称 */
  name: string;
  /** 字典编码 */
  code: string;
  /** 字典类型 */
  type: DictTypeEnum;
  /** 字典状态 */
  status: StatusEnum;
  /** 字典排序 */
  sort: number;
  /** 字典描述 */
  remarks: string;
  /** 创建时间 */
  createAt: Date;
  /** 更新时间 */
  updateAt: Date;
  /** 虚拟字段 - 转换id */
  id?: string;
  /** 虚拟字段 - 创建时间 */
  createTime?: string;
}

const dictSchema = new mongoose.Schema<DictType>(
  {
    /** 字典所属的租户id */
    tenantId: {
      type: String,
      required: true,
    },
    /** 字典名称 */
    name: {
      type: String,
      required: true, // 必填
      index: true, // 索引
      minlength: [1, '字典名称长度不能小于 1 个字符'],
      maxlength: [20, '字典名称长度不能大于 20 个字符'],
    },
    /** 字典编码 */
    code: {
      type: String,
      required: true,
      index: true,
      minlength: [1, '字典名称长度不能小于 1 个字符'],
      maxlength: [20, '字典名称长度不能大于 20 个字符'],
    },
    /** 字典类型 0 系统 1 自定义 */
    type: {
      type: Number,
      required: true,
      enum: getEnumAllValues(DictTypeEnum),
      default: DictTypeEnum.SYSTEM,
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
  },
  {
    timestamps: true, // 关键：启用自动时间戳
  }
);

// 创建复合唯一索引（tenantId + name 组合唯一）
dictSchema.index({ tenantId: 1, name: 1 }, { unique: true });
dictSchema.index({ tenantId: 1, code: 1 }, { unique: true });

// 手动转换数据方法
export function transfromDictData(
  data?: Partial<DictType> | Partial<DictType>[] | null
) {
  if (!data) return data;

  const ret = (Array.isArray(data) ? data : [data]).map((item) => {
    const copyItem = { ...item };

    // 虚拟字段 id
    if (copyItem._id) {
      // 虚拟字段
      copyItem.id = copyItem._id.toString();

      delete copyItem._id;
    }

    if (copyItem.createAt) {
      copyItem.createTime = dayjs(copyItem.createAt).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      delete copyItem.createAt;
    }
    return copyItem;
  });

  return Array.isArray(data) ? ret : ret[0];
}

// 定义 Model
const DictModel = mongoose.model('Dict', dictSchema);

export default DictModel;

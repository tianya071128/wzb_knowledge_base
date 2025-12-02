import mongoose from 'mongoose';
import { StatusEnum } from '../../utils/dict';
import { RegionTypeEnum } from '../../utils/dict/system';
import { getEnumAllValues } from '../../utils';

/**
 * 区域管理结构类型
 */
export interface RegionType {
  /** 系统字段 */
  _id: mongoose.Types.ObjectId | string;
  /** 区域名称 */
  name: string;
  /** 区域编码 */
  code: string;
  /** 父级区域id */
  parentId: string;
  /** 区域状态 */
  status: StatusEnum;
  /** 区域类型 */
  type: RegionTypeEnum;
  /** 区域排序 */
  sort: number;
  /** 备注 */
  remarks: string;
  /** 辅助字段 - 路径 ids */
  parentIds: string;
  /** 辅助字段 - 是否存在子节点 */
  hasChildren: boolean;
  /** 创建时间 */
  createAt: Date;
  /** 更新时间 */
  updateAt: Date;
  /** 虚拟字段 - 转换id */
  id?: string;
  /** 虚拟字段 - 创建时间 */
  createTime?: string;
}

const RegionSchema = new mongoose.Schema<RegionType>(
  {
    /** 区域名称 */
    name: {
      type: String,
      required: true,
      index: true, // 建立索引
    },
    /** 区域编码 */
    code: {
      type: String,
      required: true,
      unique: true, // 唯一索引
    },
    /** 区域类型 */
    type: {
      type: Number,
      required: true,
      enum: getEnumAllValues(RegionTypeEnum),
    },
    /** 父级区域id */
    parentId: {
      type: String,
      default: '0',
    },
    /** 状态 */
    status: {
      type: Number,
      required: true,
      enum: getEnumAllValues(StatusEnum),
    },
    /** 排序 */
    sort: {
      type: Number,
      default: 0,
    },
    /** 描述 */
    remarks: {
      type: String,
      default: '',
    },
    /** 辅助字段 - 路径 ids */
    parentIds: {
      type: String,
    },
    /** 辅助字段 - 是否存在子节点 */
    hasChildren: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // 启用自动时间戳
  }
);

// 创建模型
const RegionModel = mongoose.model<RegionType>('Region', RegionSchema);

export default RegionModel;

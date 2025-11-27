import mongoose, { InferSchemaType } from 'mongoose';
import dayjs from 'dayjs';
import { DictTypeEnum } from '../utils/dict/system';
import { StatusEnum } from '../utils/dict';
import { getEnumAllValues } from '../utils';

const dictSchema = new mongoose.Schema(
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
    // 创建时间（自动添加，无需手动赋值）
    createAt: {
      type: Date,
      default: Date.now,
      immutable: true, // 不可修改（创建后固定）
    },
    // 更新时间（自动更新）
    updateAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    lean: { virtuals: true }, // 启用 lean 虚拟字段支持
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
    // 虚拟字段 id
    if (item._id) {
      // 虚拟字段
      item.id = item._id.toString();

      delete item._id;
    }

    if (item.createAt) {
      item.createTime = dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss');

      delete item.createAt;
    }
    return item;
  });

  return Array.isArray(data) ? ret : ret[0];
}

// 自动推导核心类型（从 Schema 提取字段类型）
export type DictType = InferSchemaType<typeof dictSchema> & {
  // 虚拟字段
  id?: string;
  // 格式化后的时间
  createTime?: string;
  // _id：兼容 ObjectId 实例和字符串（前端传输/查询常用字符串）
  _id: mongoose.Types.ObjectId | string;
  // __v：Mongoose 版本号（默认 number，若禁用则删除该字段）
  __v: number;
};

// 定义 Model
const DictModel = mongoose.model('Dict', dictSchema);

export default DictModel;

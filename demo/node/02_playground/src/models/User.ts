import mongoose, { InferSchemaType } from 'mongoose';
import { emailReg, phoneReg } from '../utils/reg';

// 定义 Schema
const userSchema = new mongoose.Schema({
  // 用户名（必填、唯一、字符串类型）
  nickname: {
    type: String,
    required: [true, '用户名不能为空'], // 自定义错误提示
    unique: true, // 唯一索引（避免重复用户名）
    minlength: [2, '用户名最小 2 个字符'],
    maxlength: [20, '用户名最长 15 个字符'], // 长度限制
  },
  // 手机号（必填、唯一、格式验证）
  mobile: {
    type: String,
    required: [true, '手机号不能为空'],
    unique: true, // 唯一索引
    trim: true, // 去除前后空格
    match: [phoneReg, '请输入合法手机号'],
  },
  // 账号（登录用，唯一，与用户名区分）
  username: {
    type: String,
    required: [true, '账号不能为空'],
    unique: true, // 唯一约束（禁止重复账号）
    trim: true,
    maxlength: [20, '账号最长 20 个字符'],
    minlength: [4, '账号最短 4 个字符'],
    index: true,
  },
  // 5. 邮箱（可选，填写则需合法格式）
  email: {
    type: String,
    required: false, // 可选字段
    unique: true,
    trim: true,
    lowercase: true, // 自动转为小写（避免大小写重复）
    match: [emailReg, '请输入合法的邮箱地址'],
    default: null,
  },
  // 年龄（可选，范围限制）
  age: {
    type: Number,
    required: false,
    min: [0, '年龄不能小于 0 岁'],
    max: [150, '年龄不能大于 150 岁'],
    default: null, // 未填写时为 null（避免默认 0 造成歧义）
  },
  // 创建时间（自动添加，无需手动赋值）
  create_time: {
    type: Date,
    default: Date.now,
    immutable: true, // 不可修改（创建后固定）
  },
  // 更新时间（自动更新）
  update_time: {
    type: Date,
    default: Date.now,
  },
});

// 中间件：更新时自动更新 update_time 字段（Mongoose 内置，也可手动定义）
// userSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
//   this.set({ update_time: Date.now() });
//   next();
// });

// 定义 Model（集合名自动转为复数：User → users）
const UserModel = mongoose.model('User', userSchema);

// 自动推导核心类型（从 Schema 提取字段类型）
export type UserType = InferSchemaType<typeof userSchema> & {
  // _id：兼容 ObjectId 实例和字符串（前端传输/查询常用字符串）
  _id: mongoose.Types.ObjectId | string;
  // __v：Mongoose 版本号（默认 number，若禁用则删除该字段）
  __v: number;
};

export default UserModel;

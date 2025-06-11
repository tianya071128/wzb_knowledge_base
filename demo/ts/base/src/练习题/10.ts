// 实现一个 Trim 工具类型，用于对字符串字面量类型进行去空格处理。具体的使用示例如下所示：
type S = Trim<' semlinker '>; //=> 'semlinker'

// #region ------------ 个人实现 ------------
// 不会
// #endregion

// #region ------------ github 实现 ------------
type TrimLeft<T extends string> = T extends ` ${infer S}` ? TrimLeft<S> : T;
type TrimRight<T extends string> = T extends `${infer S} ` ? TrimRight<S> : T;
type Trim<T extends string> = TrimLeft<TrimRight<T>>;
// #endregion

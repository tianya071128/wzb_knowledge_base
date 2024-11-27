// 定义一个 JoinStrArray 工具类型，用于根据指定的 Separator 分隔符，对字符串数组类型进行拼接。具体的使用示例如下所示：

// 测试用例
type Names = ['Sem', 'Lolo', 'Kaquko'];
type NamesComma = JoinStrArray<Names, ','>; // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray2<Names, ' '>; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray3<Names, '⭐️'>; // "Sem⭐️Lolo⭐️Kaquko"

// #region ------------ 个人实现 ------------
type JoinStrArray<
  Arr extends string[],
  Separator extends string,
  Result extends string = ''
> =
  // 提取出第一项和其余项
  Arr extends [infer K, ...infer P]
    ? // 如果第一项为 undefined 的话, 那么直接返回已拼接的
      K extends string
      ? JoinStrArray<
          P extends string[] ? P : [],
          Separator,
          `${Result}${Result extends '' ? '' : Separator}${K extends string
            ? K
            : ''}`
        >
      : Result
    : Result;

// #endregion

// #region ------------ github 实现 ------------
type JoinStrArray2<
  Arr extends string[],
  Separator extends string,
  Result extends string = ''
> = Arr extends [infer El, ...infer Rest]
  ? Rest extends string[]
    ? El extends string
      ? Result extends ''
        ? JoinStrArray<Rest, Separator, `${El}`>
        : JoinStrArray<Rest, Separator, `${Result}${Separator}${El}`>
      : `${Result}`
    : `${Result}`
  : `${Result}`;

type JoinStrArray3<
  Arr extends string[],
  Separator extends string
> = Arr extends [infer First extends string, ...infer Rest extends string[]]
  ? `${First}${Separator}${JoinStrArray<Rest, Separator>}`
  : '';
// #endregion

export {};

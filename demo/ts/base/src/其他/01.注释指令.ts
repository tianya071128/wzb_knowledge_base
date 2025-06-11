/**
 * 注释指令:
 *  1. // @ts-nocheck: 不对当前脚本进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本
 *  2. // @ts-check: 脚本顶部添加了// @ts-check，那么编译器将对该脚本进行类型检查，不论是否启用了checkJs编译选项
 *  3. // @ts-ignore: 不对下一行代码进行类型检查，可以用于 TypeScript 脚本，也可以用于 JavaScript 脚本
 *  4. // @ts-expect-error: 当下一行有类型错误时，它会压制 TypeScript 的报错信息（即不显示报错信息），把错误留给代码自己处理。
 *                          如果下一行没有类型错误，// @ts-expect-error则会显示一行提示。
 *                          推荐使用该注释忽略下一行的类型错误，当下一行没有错误的时候，就会给出提示
 */

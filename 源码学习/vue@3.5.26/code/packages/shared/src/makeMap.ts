/**
 * Make a map and return a function for checking if a key 制作一个映射，并返回一个用于检查键是否存在的函数
 * is in that map. 就在 map 里
 * IMPORTANT: all calls of this function must be prefixed with 重要提示：所有对此函数的调用都必须加上前缀
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary. 这样，如有必要，rollup（一种打包工具）就可以对它们进行tree-shake（一种优化技术，通过分析代码并删除未使用的代码来减小代码体积）。
 */

/*@__NO_SIDE_EFFECTS__*/
export function makeMap(str: string): (key: string) => boolean {
  const map = Object.create(null)
  for (const key of str.split(',')) map[key] = 1
  return val => val in map
}

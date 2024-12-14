/*
 * @lc app=leetcode.cn id=17 lang=javascript
 * @lcpr version=30204
 *
 * [17] 电话号码的字母组合
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  /**
   * 解题思路: 主要在于 digits 的长度不固定
   *  1. 遍历 digits, 每次都往结果中追加对应的
   */
  let res = [],
    map = [
      [],
      [],
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
      ['j', 'k', 'l'],
      ['m', 'n', 'o'],
      ['p', 'q', 'r', 's'],
      ['t', 'u', 'v'],
      ['w', 'x', 'y', 'z'],
    ];
  for (const item of digits) {
    const letters = map[item];

    // 如果是第一个, 那么就是初始化一下
    if (!res.length) {
      res = [...letters];
    } else {
      res = res.reduce(
        (total, item) => [
          ...total,
          ...letters.map((letterItem) => `${item}${letterItem}`),
        ],
        []
      );
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// "23"\n
// @lcpr case=end

// @lcpr case=start
// ""\n
// @lcpr case=end

// @lcpr case=start
// "2"\n
// @lcpr case=end

 */

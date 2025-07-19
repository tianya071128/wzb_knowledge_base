/*
 * @lc app=leetcode.cn id=686 lang=javascript
 * @lcpr version=30204
 *
 * [686] 重复叠加字符串匹配
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var repeatedStringMatch = function (a, b) {
  /**
   * 同时迭代两个字符串
   *  1. 迭代 a 时, 允许从头开始
   *  2. 如果一直迭代 b, 能与 a 进行匹配, 那么返回 true
   */
  let aLen = a.length,
    left = 0,
    right = 0,
    startIndex = 0; // 开始索引

  while (right < b.length) {
    // 字符匹配, 那么 a 和 b 同时右移移动一格
    if (a[left % aLen] === b[right]) {
      if (right === 0) {
        startIndex = left; // 记录下开始索引, 下一次从这个索引的下一个开始
      }
      left++;
      right++;
    }
    // 字符不匹配
    else {
      // 如果是在第一轮并且不是最后一个字符, 那么就可以继续重新匹配
      if (startIndex < a.length - 1) {
        startIndex = startIndex + 1;
        left = startIndex;
        right = 0; // 重置为起始位置
      }
      // 否则不匹配
      else {
        return -1;
      }
    }
  }

  return Math.ceil(left / aLen);
};
// @lc code=end

/*
// @lcpr case=start
// "abcde"\n"cdabcdab"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n"aa"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n"a"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n"wxyz"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = repeatedStringMatch;
// @lcpr-after-debug-end

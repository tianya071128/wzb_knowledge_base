/*
 * @lc app=leetcode.cn id=28 lang=javascript
 * @lcpr version=30204
 *
 * [28] 找出字符串中第一个匹配项的下标
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  /**
   * 解题思路:
   *  1. 遍历 haystack.length - needle.length + 1
   *  2. 内层遍历 needle, 对每一个字符与 haystack 字符比较, 都满足时返回索引
   */
  for (let i = 0; i < haystack.length - needle.length + 1; i++) {
    let flag = true;
    for (let j = 0; j < needle.length; j++) {
      if (needle[j] !== haystack[i + j]) {
        flag = false;
        break;
      }
    }
    if (flag) return i;
  }
  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// "sadbutsad"\n"sad"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n"leeto"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = strStr;
// @lcpr-after-debug-end

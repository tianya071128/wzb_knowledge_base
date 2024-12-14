/*
 * @lc app=leetcode.cn id=3 lang=javascript
 * @lcpr version=30204
 *
 * [3] 无重复字符的最长子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  /**
   * 解题思路:
   *  1. 设立两个指针, 指针范围内查看检测是否有重复字符
   *  2. 建立一个 hash,记录字符出现位置的索引
   *  3. 遍历字符串 s, 每次移动右指针
   *      3.1 利用 hash 表, 如果碰到了重复字符, 并且重复字符在指针范围内, 此时移动左指针到重复字符的下一位
   */
  let left = (right = 0),
    hash = {},
    onRepeatLen = 0; // 无重复字符串长度
  for (const item of s) {
    // 检测是否有重复字符
    let i = hash[item];
    if (i != null && i >= left) {
      // 检测之前的指针范围（left、right）的长度是否比已 onRepeatLen 要长
      if (right - left > onRepeatLen) {
        onRepeatLen = right - left;
      }
      // 移动左指针
      left = ++i;
    }

    //  记录字符索引 and 右指针移动
    hash[item] = right;
    right++;
  }

  // 最后还需要检测一下最长子串
  if (right - left > onRepeatLen) {
    onRepeatLen = right - left;
  }

  return onRepeatLen;
};
// @lc code=end

/*
// @lcpr case=start
// "abcabcbb"\n
// @lcpr case=end

// @lcpr case=start
// "bbbbb"\n
// @lcpr case=end

// @lcpr case=start
// "pwwkew"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = lengthOfLongestSubstring;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=14 lang=javascript
 * @lcpr version=30204
 *
 * [14] 最长公共前缀
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  /**
   * 初版思路:
   *  - 先取数组第一项为公共前缀
   *  - 遍历数组, 与除了第一项的其他项进行比较, 不匹配时, 缩小公共前缀
   *  - 逐步缩小公共前缀, 直至公共前缀为 "" 或者遍历完了数组
   */
  let prefix = strs[0] ?? '';
  for (const s of strs.slice(1)) {
    // 如果匹配的话, 那么进行下一项
    while (prefix) {
      if (s.startsWith(prefix)) break;

      prefix = prefix.slice(0, -1);
    }

    if (!prefix) return prefix;
  }

  return prefix;
};
// @lc code=end

/*
// @lcpr case=start
// ["flower","flow","flight"]\n
// @lcpr case=end

// @lcpr case=start
// ["dog","racecar","car"]\n
// @lcpr case=end

 */

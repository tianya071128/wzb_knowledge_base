/*
 * @lc app=leetcode.cn id=1081 lang=javascript
 * @lcpr version=30204
 *
 * [1081] 不同字符的最小子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var smallestSubsequence = function (s) {
  /**
   * 遍历 s
   *  - 如果字符没有出现过, 直接追加到结果中
   *  - 如果字符出现过
   *      - 如果之前的字符组成的结果比现在的字符组成要大, 则替换
   */
  let ans = [],
    /** @type {Map<string, number>} Map<字符, 索引> */
    hash = new Map();
  for (let i = 0; i < s.length; i++) {
    if (!hash.has(s[i])) {
      // 不存在, 直接追加
      ans.push(s[i]);
      hash.set(s[i], ans.length - 1);
    } else {
      // 否则判断之前字符的索引之后的字符是否比该字符的字典序要小
      let prevIndex = hash.get(s[i]);

      if (prevIndex < ans.length - 1 && ans[prevIndex + 1] < s[i]) {
        // 原来的字符重置为 '', 防止后面字符索引变化
        ans[hash.get(s[i])] = '';
        ans.push(s[i]);
        hash.set(s[i], ans.length - 1);
      }
    }
  }

  return ans.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "bcabc"\n
// @lcpr case=end

// @lcpr case=start
// "cbacdcbc"\n
// @lcpr case=end

// @lcpr case=start
// "cbaacabcaaccaacababa"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = smallestSubsequence;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=30 lang=javascript
 * @lcpr version=30204
 *
 * [30] 串联所有单词的子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
var findSubstring = function (s, words) {
  /**
   * 滑动窗口:
   *  - 使用 哈希表记录 words 的字符 --> 可能会重复, 所以记录个数
   */
  let hash = new Map(),
    len = words[0].length,
    total = len * words.length; // 总长度
  for (const word of words) {
    hash.set(word, (hash.get(word) ?? 0) + 1);
  }

  // 窗口
  let ans = [];
  for (let i = 0; i <= s.length - total; i++) {
    // 启动比对
    let copyHash = new Map(hash);

    for (let j = i; j < i + total; j += len) {
      // 当前匹配字符
      let matchStr = '';
      for (let k = j; k < j + len; k++) {
        matchStr += s[k];
      }

      // 不匹配, 退出
      if (!copyHash.has(matchStr)) break;

      if (copyHash.get(matchStr) === 1) {
        copyHash.delete(matchStr);
      } else {
        copyHash.set(matchStr, copyHash.get(matchStr) - 1);
      }
    }

    if (copyHash.size === 0) {
      ans.push(i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "barfoothefoobarman"\n["foo","bar"]\n
// @lcpr case=end

// @lcpr case=start
// "oooooooo"\n["oo","oo"]\n
// @lcpr case=end

// @lcpr case=start
// "oooooo"\n["bar","foo","the"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findSubstring;
// @lcpr-after-debug-end

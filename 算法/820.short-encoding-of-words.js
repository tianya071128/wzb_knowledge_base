/*
 * @lc app=leetcode.cn id=820 lang=javascript
 * @lcpr version=30204
 *
 * [820] 单词的压缩编码
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {number}
 */
var minimumLengthEncoding = function (words) {
  /**
   * 关键点在于: 如果两个字符从末尾是包含关系, 那么这两个字符可以复用
   *  例如 "time" 和 "me" --> "time#" 就可以进行表示
   */
  let hash = new Set(),
    ans = 0;

  // 将 words 排序
  words.sort((a, b) => b.length - a.length);

  for (const item of words) {
    // 不存在, 追加进结果
    if (!hash.has(item)) {
      ans += item.length + 1;

      // 将 item 从后往前切割至 hash 中
      let str = '';
      for (let i = item.length - 1; i >= 0; i--) {
        str = item[i] + str;

        hash.add(str);
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["time", "me", "bell", "ell"]\n
// @lcpr case=end

// @lcpr case=start
// ["t"]\n
// @lcpr case=end

 */

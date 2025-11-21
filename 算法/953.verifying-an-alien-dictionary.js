/*
 * @lc app=leetcode.cn id=953 lang=javascript
 * @lcpr version=30204
 *
 * [953] 验证外星语词典
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @param {string} order
 * @return {boolean}
 */
var isAlienSorted = function (words, order) {
  /**
   * 使用 hash 存储 order 的索引作为大小
   */
  const hash = new Map([[undefined, -1]]);

  for (let i = 0; i < order.length; i++) {
    hash.set(order[i], i);
  }

  // 在比较 words 前后是否按字典序排序的
  for (let i = 1; i < words.length; i++) {
    let s1 = words[i - 1],
      s2 = words[i];
    for (let j = 0; j < s1.length; j++) {
      if (hash.get(s1[j]) < hash.get(s2[j])) {
        // 升序
        break;
      } else if (hash.get(s1[j]) > hash.get(s2[j])) {
        // 降序
        return false;
      } else {
        // 相同, 比较下一个
      }
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// ["hello","leetcode"]\n"hlabcdefgijkmnopqrstuvwxyz"\n
// @lcpr case=end

// @lcpr case=start
// ["word","world","row"]\n"worldabcefghijkmnpqstuvxyz"\n
// @lcpr case=end

// @lcpr case=start
// ["apple","app"]\n"abcdefghijklmnopqrstuvwxyz"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isAlienSorted;
// @lcpr-after-debug-end

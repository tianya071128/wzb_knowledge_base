/*
 * @lc app=leetcode.cn id=1790 lang=javascript
 * @lcpr version=30204
 *
 * [1790] 仅执行一次字符串交换能否使两个字符串相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var areAlmostEqual = function (s1, s2) {
  /** @type {number[]} 字符不同的索引集合 */
  let list = [];

  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      list.push(i);

      if (list.length > 2) return false;
    }
  }

  if (list.length === 0) return true;
  if (list.length === 1) return false;
  return s1[list[0]] === s2[list[1]] && s1[list[1]] === s2[list[0]];
};
// @lc code=end

/*
// @lcpr case=start
// "bank"\n"kanb"\n
// @lcpr case=end

// @lcpr case=start
// "attack"\n"defend"\n
// @lcpr case=end

// @lcpr case=start
// "kelb"\n"kelb"\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n"dcba"\n
// @lcpr case=end

 */

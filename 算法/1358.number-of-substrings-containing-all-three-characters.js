/*
 * @lc app=leetcode.cn id=1358 lang=javascript
 * @lcpr version=30204
 *
 * [1358] 包含所有三种字符的子字符串数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var numberOfSubstrings = function (s) {
  /**
   * 贪心: 当满足每个字母都存在的话, 那么后面剩余的长度就是可以叠加的结果
   */
  let ans = 0,
    lens = [0, 0, 0];

  // 使用滑动窗口, 窗口中满足每个字母至少一次的话
  let l = 0,
    r = -1;

  while (r < s.length) {
    // 如果不满足的话, 扩展右区间
    while (r < s.length && (lens[0] === 0 || lens[1] === 0 || lens[2] === 0)) {
      r++;
      r < s.length && lens[s[r].charCodeAt() - 'a'.charCodeAt()]++;
    }

    if (r < s.length) {
      // 满足结果
      ans += s.length - r;
    }

    // 移动左区间
    lens[s[l].charCodeAt() - 'a'.charCodeAt()]--;
    l++;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numberOfSubstrings
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcaabbcabcbcacabcbcabcbcaabbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcaabbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcaabbcacabcbcaabcbcabbcacababbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcaabbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcacbcaabbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbcaabbcabcbcacabcbcabcbcaabbcacabcbcaabcbcabbcacabcbca"\n
// @lcpr case=end

// @lcpr case=start
// "aaacb"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numberOfSubstrings;
// @lcpr-after-debug-end

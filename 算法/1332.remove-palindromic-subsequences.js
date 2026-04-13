/*
 * @lc app=leetcode.cn id=1332 lang=javascript
 * @lcpr version=30204
 *
 * [1332] 删除回文子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var removePalindromeSub = function (s) {
  /**
   * 脑筋急转弯: 当字符 s 不是回文时, 此时就是 2 次, 否则就是一次
   *
   *  - 不是回文时, 先全部删除 a, 在全部删除 b
   */
  let l = 0,
    r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return 2;

    l++;
    r--;
  }

  return 1;
};
// @lc code=end

/*
// @lcpr case=start
// "ababa"\n
// @lcpr case=end

// @lcpr case=start
// "abb"\n
// @lcpr case=end

// @lcpr case=start
// "baabb"\n
// @lcpr case=end

 */

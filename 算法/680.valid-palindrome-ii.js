/*
 * @lc app=leetcode.cn id=680 lang=javascript
 * @lcpr version=30204
 *
 * [680] 验证回文串 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function (s, not) {
  /**
   * 双指针, 当碰过无法回文的时候, 那么就尝试两条路即可
   */
  let left = 0,
    right = s.length - 1;

  while (right > left) {
    if (s[left] !== s[right]) {
      // 不可删除
      if (not) return false;

      // 可删除
      return (
        validPalindrome(s.slice(left + 1, right + 1), true) ||
        validPalindrome(s.slice(left, right), true)
      );
    }

    left++;
    right--;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "acsabccabasca"\n
// @lcpr case=end     

// @lcpr case=start
// "abca"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = validPalindrome;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=665 lang=javascript
 * @lcpr version=30204
 *
 * [665] 非递减数列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var checkPossibility = function (nums) {
  /**
   * 通过率这么低, 难怪不是判断一下非递减元素的个数不就可以了吗?
   */
  let allow = 1,
    twoNum = -Infinity,
    prevNum = -Infinity;

  for (const n of nums) {
    if (n >= prevNum) {
      twoNum = prevNum;
      prevNum = n;
    } else {
      allow--;

      // 如果当前元素更合适的话
      if (n >= twoNum) {
        prevNum = n;
      }

      if (allow < 0) return false;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkPossibility;
// @lcpr-after-debug-end

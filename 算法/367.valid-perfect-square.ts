/*
 * @lc app=leetcode.cn id=367 lang=typescript
 * @lcpr version=30204
 *
 * [367] 有效的完全平方数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function isPerfectSquare(num: number): boolean {
  // 与 69 题类似
  // 二分查找
  let left = 0,
    right = num;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (mid * mid >= num) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left * left === num;
}
// @lc code=end

/*
// @lcpr case=start
// 16\n
// @lcpr case=end

// @lcpr case=start
// 14\n
// @lcpr case=end

 */

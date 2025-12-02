/*
 * @lc app=leetcode.cn id=1362 lang=javascript
 * @lcpr version=30204
 *
 * [1362] 最接近的因数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @return {number[]}
 */
var closestDivisors = function (num) {
  /**
   * 两种情况都比较一下即可
   */
  num++; // 首先是 num + 1

  let ans = [0, 0];
  for (let i = Math.floor(Math.sqrt(num)); i >= 1; i--) {
    if (num % i === 0) {
      ans = [i, num / i];
      break;
    }
  }

  num++;
  for (let i = Math.floor(Math.sqrt(num)); i >= 1; i--) {
    if (num % i === 0) {
      if (Math.abs(i - num / i) < Math.abs(ans[0] - ans[1])) {
        ans = [i, num / i];
      }
      break;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 8\n
// @lcpr case=end

// @lcpr case=start
// 123\n
// @lcpr case=end

// @lcpr case=start
// 999\n
// @lcpr case=end

 */

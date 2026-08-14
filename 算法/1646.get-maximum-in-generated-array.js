/*
 * @lc app=leetcode.cn id=1646 lang=javascript
 * @lcpr version=30204
 *
 * [1646] 获取生成数组中的最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var getMaximumGenerated = function (n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;

  /** @type {number[]} 初始值 */
  let arr = [0, 1, 1],
    /** @type {number} 结果 */
    ans = 1;

  for (let i = 3; i <= n; i++) {
    if (i % 2 === 0) {
      // 偶数
      arr.push(arr[i / 2]);
    } else {
      // 奇数
      arr.push(arr[Math.floor(i / 2)] + arr[Math.ceil(i / 2)]);
    }
    ans = Math.max(ans, arr.at(-1));
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

 */

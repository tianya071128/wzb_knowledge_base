/*
 * @lc app=leetcode.cn id=565 lang=javascript
 * @lcpr version=30204
 *
 * [565] 数组嵌套
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayNesting = function (nums) {
  /**
   * 1. 一次迭代
   * 2. 记录下链条的长度, 并且将扫描过的标记一下, 直接复用 nums 标记为 -1
   * 3. 迭代过程中, 如果已经扫描过的, 直接略过
   */
  let ans = 0,
    surplusLen = nums.length; // 未扫描总长度, 用于比较提前结束遍历
  for (let i = 0; i < nums.length; i++) {
    let n = nums[i],
      len = 1;

    // 如果已经扫描过的, 直接略过
    if (n === -1) continue;

    // 标记为 -1
    nums[i] = -1;
    while (nums[n] !== -1) {
      len++;
      [nums[n], n] = [-1, nums[n]];
    }

    ans = Math.max(ans, len);

    // 提前判断
    surplusLen -= len;
    if (ans >= surplusLen) break;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,0,3,1,6,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = arrayNesting;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=611 lang=javascript
 * @lcpr version=30204
 *
 * [611] 有效三角形的个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var triangleNumber = function (nums) {
  /**
   * 三角形: 两边之和大于第三边
   *
   *  1. 先排序
   *  2. 确定最小边和最大边, 那么第三条边 > max - min
   */
  nums = nums.sort((a, b) => a - b).filter((item) => !!item); // 抛弃 0

  let ans = 0,
    mid = 1; // 中间指针

  // 外层遍历最大边
  for (let i = 2; i < nums.length; i++) {
    // 确定第一个比 nums[i] - nums[0] 大的索引
    // 通过移动 mid 来实现 --> 因为外层遍历最大值, 区间值变大, 那么应该比上一次结果要大, 往右移动
    const diff = nums[i] - nums[0];
    while (nums[mid] <= diff && mid < i) {
      mid++;
    }

    // 内层遍历最小边
    let curMid = mid;
    for (let j = 0; j <= i - 2; j++) {
      // 移动 curMid 来检测第一个 nums[i] - nums[j] 大的索引 --> 往左移动
      const diff = nums[i] - nums[j];
      while ((nums[curMid - 1] > diff && curMid < j - 1) || curMid >= i) {
        curMid--;
      }

      // 如果当前指针, 那么内层遍历无意义
      if (nums[curMid] <= diff && curMid === j + 1) break;

      ans += i - curMid;

      // 如果 curMid 刚好与 j + 1 相同, curMid 往右移动一次
      if (curMid === j + 1) curMid++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,3,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = triangleNumber;
// @lcpr-after-debug-end

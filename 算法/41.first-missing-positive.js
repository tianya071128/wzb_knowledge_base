/*
 * @lc app=leetcode.cn id=41 lang=javascript
 * @lcpr version=30204
 *
 * [41] 缺失的第一个正数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
  /**
   * 利用传入 nums 的空间
   */
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    /**
     * 如果该元素项位置的数字不是索引位置的, 则移动到对应位置
     *  - 如果该项的值不是合法范围的, 不处理 --> 1 <= val <= nums.length
     *  - 最终让合法的值都在对应位置上
     */
    while (
      nums[i] >= 1 && // 合法值
      nums[i] <= len && // 合法值
      nums[i] !== i + 1 && // 不等于索引位置
      nums[nums[i] - 1] !== nums[i] // 并且应该到的位置, 两个值不同
    ) {
      // 交换位置
      let temp = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = temp;
    }
  }

  // 继续遍历一下, 找到第一个不在索引位置的值
  for (let i = 0; i < len; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  return len + 1;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,0]\n
// @lcpr case=end

// @lcpr case=start
// [3,4,-1,1]\n
// @lcpr case=end

// @lcpr case=start
// [5,4,3,2,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = firstMissingPositive;
// @lcpr-after-debug-end

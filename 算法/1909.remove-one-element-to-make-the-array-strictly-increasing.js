/*
 * @lc app=leetcode.cn id=1909 lang=javascript
 * @lcpr version=30204
 *
 * [1909] 删除一个元素使数组严格递增
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canBeIncreasing = function (nums) {
  /** @type {number} 之前两个元素 */
  let prevTwo = 0,
    /** @type {number} 上一个 */
    prev = nums[0],
    /** @type {boolean} 标记是否已删除元素 */
    flag = false;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= prev) {
      if (flag) return false;
      flag = true;
      // 有两种情况, 删除当前元素或者删除上一个元素

      // 如果当前元素比之前第二个元素大, 则删除上一个元素
      if (nums[i] > prevTwo) {
        prev = nums[i];
      } else {
        // 否则操作当前元素, 不做操作
      }
    } else {
      [prevTwo, prev] = [prev, nums[i]];
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,10,5,7]\n
// @lcpr case=end

// @lcpr case=start
// [2,3,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

 */

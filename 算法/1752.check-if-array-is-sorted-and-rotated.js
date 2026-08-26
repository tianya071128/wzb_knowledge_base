/*
 * @lc app=leetcode.cn id=1752 lang=javascript
 * @lcpr version=30204
 *
 * [1752] 检查数组是否经排序和轮转得到
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var check = function (nums) {
  /** @type {boolean} 标识是否已经存在比上一个值小的 */
  let flag = false;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) {
      if (flag) return false;
      flag = true;
    }

    if (flag && nums[i] > nums[0]) return false;
  }

  return true;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=check
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [3,4,5,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = check;
// @lcpr-after-debug-end

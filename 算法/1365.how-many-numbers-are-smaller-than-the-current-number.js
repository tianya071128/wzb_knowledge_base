/*
 * @lc app=leetcode.cn id=1365 lang=javascript
 * @lcpr version=30204
 *
 * [1365] 有多少小于当前数字的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var smallerNumbersThanCurrent = function (nums) {
  // 排序
  let list = nums.map((item, i) => [item, i]).sort((a, b) => a[0] - b[0]);

  // 计算
  for (let i = 0; i < list.length; i++) {
    nums[list[i][1]] =
      list[i][0] === list[i - 1]?.[0] ? nums[list[i - 1][1]] : i;
  }

  return nums;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=smallerNumbersThanCurrent
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [8,1,2,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [6,5,4,8]\n
// @lcpr case=end

// @lcpr case=start
// [7,7,7,7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = smallerNumbersThanCurrent;
// @lcpr-after-debug-end

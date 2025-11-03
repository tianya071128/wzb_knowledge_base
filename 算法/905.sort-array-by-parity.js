/*
 * @lc app=leetcode.cn id=905 lang=javascript
 * @lcpr version=30204
 *
 * [905] 按奇偶排序数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParity = function (nums) {
  let ans = Array(nums.length),
    l = 0,
    r = nums.length - 1;

  for (const n of nums) {
    if (n % 2 === 0) {
      ans[l] = n;
      l++;
    } else {
      ans[r] = n;
      r--;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,1,2,4]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=238 lang=javascript
 * @lcpr version=30204
 *
 * [238] 除自身以外数组的乘积
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  // 前缀和
  // 先正序求出前缀积
  // 再倒序求出前缀积
  // 那么对于 i 而言: f(1) = 正序(i - 1) * 倒序(nums.length - i - 1)

  let prefix1 = []; // 正序
  let prefix2 = []; // 倒序
  for (let i = 0; i < nums.length; i++) {
    prefix1.push((prefix1[i - 1] ?? 1) * nums[i]);

    const reversI = nums.length - 1 - i;
    prefix2.push((prefix2[i - 1] ?? 1) * nums[reversI]);
  }

  return nums.map(
    (item, index) =>
      (prefix1[index - 1] ?? 1) * (prefix2[nums.length - 1 - index - 1] ?? 1)
  );
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [-1,1,0,-3,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = productExceptSelf;
// @lcpr-after-debug-end

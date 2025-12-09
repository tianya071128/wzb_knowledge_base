/*
 * @lc app=leetcode.cn id=1313 lang=javascript
 * @lcpr version=30204
 *
 * [1313] 解压缩编码列表
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var decompressRLElist = function (nums) {
  let ans = [];
  for (let i = 0; i < nums.length; i += 2) {
    for (let j = 1; j <= nums[i]; j++) {
      ans.push(nums[i + 1]);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,3]\n
// @lcpr case=end

 */

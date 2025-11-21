/*
 * @lc app=leetcode.cn id=922 lang=javascript
 * @lcpr version=30204
 *
 * [922] 按奇偶排序数组 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParityII = function (nums) {
  let ans = [],
    p1 = 0, // 偶数
    p2 = 1; // 奇数

  for (const n of nums) {
    if (n % 2 === 0) {
      ans[p1] = n;
      p1 += 2;
    } else {
      ans[p2] = n;
      p2 += 2;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,5,7]\n
// @lcpr case=end

// @lcpr case=start
// [2,3]\n
// @lcpr case=end

 */

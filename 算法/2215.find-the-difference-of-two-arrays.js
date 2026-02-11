/*
 * @lc app=leetcode.cn id=2215 lang=javascript
 * @lcpr version=30204
 *
 * [2215] 找出两数组的不同
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[][]}
 */
var findDifference = function (nums1, nums2) {
  let hash1 = new Set(),
    hash2 = new Set();

  for (const n of nums1) {
    hash1.add(n);
  }

  for (const n of nums2) {
    hash2.add(n);
  }

  let ans = [[], []];
  for (const n of hash1) {
    if (!hash2.has(n)) ans[0].push(n);
  }
  for (const n of hash2) {
    if (!hash1.has(n)) ans[1].push(n);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n[2,4,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,3]\n[1,1,2,2]\n
// @lcpr case=end

 */

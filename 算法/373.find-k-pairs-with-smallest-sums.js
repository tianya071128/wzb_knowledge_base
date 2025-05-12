/*
 * @lc app=leetcode.cn id=373 lang=javascript
 * @lcpr version=30204
 *
 * [373] 查找和最小的 K 对数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function (nums1, nums2, k) {
  /** */
  let ans = [],
    n1 = 0,
    n2 = 0;
  while (ans.length < k) {
    ans.push([nums1[n1], nums2[n2]]);

    /**
     * 移动第一个数组的指针:
     *  1. nums2 数组已经到尽头
     *  2. nums1 与下一个元素的大小比 nums2 的要小
     */
    if (
      n2 === nums2.length - 1 ||
      (nums1[n1 + 1] ?? Infinity) - nums1[n1] < nums2[n2 + 1] - nums2[n2]
    ) {
      n1++;
    } else {
      n2++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,7,11]\n[2,4,6]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2]\n[1,2,3]\n2\n
// @lcpr case=end

 */

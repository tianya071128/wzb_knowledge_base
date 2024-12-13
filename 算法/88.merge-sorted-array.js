/*
 * @lc app=leetcode.cn id=88 lang=javascript
 * @lcpr version=30204
 *
 * [88] 合并两个有序数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  /**
   * 解题思路:
   *  1. 拷贝一份 nums1
   *  2. 双指针指向 nums1(拷贝数组) 和 nums2
   *  3. 遍历双指针, 直至到 m、n
   */
  let copy = [...nums1],
    left = (right = 0),
    item1,
    item2;
  while (left + right < m + n) {
    item1 = copy[left];
    item2 = nums2[right];

    // 何时移动右指针?
    // 左指针已超出范围 || 左指针的值大于右指针的值
    if (left >= m || (item2 != undefined && item1 > item2)) {
      nums1[left + right] = item2;
      right++;
    } else {
      nums1[left + right] = item1;
      left++;
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,0,0,0]\n3\n[2,5,6]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n[]\n0\n
// @lcpr case=end

// @lcpr case=start
// [0]\n0\n[1]\n1\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=870 lang=javascript
 * @lcpr version=30204
 *
 * [870] 优势洗牌
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var advantageCount = function (nums1, nums2) {
  /**
   * 贪心:
   *  - 要压过右边的, 那么就需要找到压过右边的数中的最小值
   *  - 如果没有找到, 那么就使用本来最小的
   */
  // 1. 排序 nums1
  nums1.sort((a, b) => a - b);

  let ans = [];
  for (const item of nums2) {
    // 在 nums1 中, 找到对应值的索引
    const i = find(nums1, item);

    ans.push(nums1[i]);
    nums1.splice(i, 1);
  }
  return ans;
};

/**
 *
 * @param {number[]} nums1
 * @param {number} n
 * @return {number}
 */
function find(nums1, n) {
  // 闭区间二分搜索查找
  let left = 0,
    right = nums1.length - 1;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    // 在左区间
    if (nums1[mid] > n) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  // 如果指定值不满足, 那么就直接返回最小值
  return nums1[left] > n ? left : 0;
}
// @lc code=end

/*
// @lcpr case=start
// [2,7,11,15]\n[1,10,4,11]\n
// @lcpr case=end

// @lcpr case=start
// [12,24,8,32]\n[13,25,32,11]\n
// @lcpr case=end

 */

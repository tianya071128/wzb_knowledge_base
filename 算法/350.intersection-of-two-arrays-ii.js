/*
 * @lc app=leetcode.cn id=350 lang=javascript
 * @lcpr version=30204
 *
 * [350] 两个数组的交集 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function (nums1, nums2) {
  // 将 nums2 的元素使用 Map 计数
  const map = new Map();
  for (const n of nums2) {
    map.set(n, (map.get(n) ?? 0) + 1);
  }

  // 迭代 nums1, 在 map 查找是否存在交集
  const ans = [];
  for (const n of nums1) {
    const num = map.get(n) ?? 0;
    if (num > 0) {
      ans.push(n);
      map.set(n, num - 1);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,1]\n[2,2]\n
// @lcpr case=end

// @lcpr case=start
// [4,9,5]\n[9,4,9,8,4]\n
// @lcpr case=end

 */

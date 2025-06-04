/*
 * @lc app=leetcode.cn id=454 lang=javascript
 * @lcpr version=30204
 *
 * [454] 四数相加 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化:
 *  nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
 *
 *  等同于求: nums1[i] + nums2[j] == 0 - (nums3[k] + nums4[l])
 *  所以可以遍历前两个数组的和并存入哈希表中, 之后遍历后两个数组的和在之前的哈希表中找出数量
 *  也就变成 O(n2) 复杂度
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function (nums1, nums2, nums3, nums4) {
  /**
   * 回溯试试, 最多 n ** 3 次 --> 200 ** 3 = 8000000
   *  超时
   */
  // 最后一个数组使用哈希表快速查找
  let map = new Map(),
    ans = 0;
  for (const n of nums4) {
    map.set(n, (map.get(n) ?? 0) + 1);
  }

  // 迭代前三个数组
  for (const n1 of nums1) {
    for (const n2 of nums2) {
      for (const n3 of nums3) {
        ans += map.get(0 - n1 - n2 - n3) ?? 0;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2]\n[-2,-1]\n[-1,2]\n[0,2]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n[0]\n[0]\n[0]\n
// @lcpr case=end

 */

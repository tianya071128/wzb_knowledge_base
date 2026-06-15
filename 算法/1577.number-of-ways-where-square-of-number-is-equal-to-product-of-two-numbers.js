/*
 * @lc app=leetcode.cn id=1577 lang=javascript
 * @lcpr version=30204
 *
 * [1577] 数的平方等于两数乘积的方法数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var numTriplets = function (nums1, nums2) {
  // 直接模拟
  let ans = 0,
    helper = (nums1, nums2) => {
      // 对 nums2 求幂, 使用 hash 存储
      let hash = new Map();
      for (const n of nums2) {
        hash.set(n ** 2, (hash.get(n ** 2) ?? 0) + 1);
      }

      for (let i = 0; i < nums1.length - 1; i++) {
        for (let j = i + 1; j < nums1.length; j++) {
          if (hash.has(nums1[i] * nums1[j]))
            ans += hash.get(nums1[i] * nums1[j]);
        }
      }
    };

  helper(nums1, nums2);
  helper(nums2, nums1);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [7,4]\n[5,2,8,9]\n
// @lcpr case=end

// @lcpr case=start
// [1,1]\n[1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [7,7,8,3]\n[1,2,9,7]\n
// @lcpr case=end

// @lcpr case=start
// [4,7,9,11,23]\n[3,5,1024,12,18]\n
// @lcpr case=end

 */

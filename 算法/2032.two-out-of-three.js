/*
 * @lc app=leetcode.cn id=2032 lang=javascript
 * @lcpr version=30204
 *
 * [2032] 至少在两个数组中出现的值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @return {number[]}
 */
var twoOutOfThree = function (nums1, nums2, nums3) {
  /**
   * 使用数组记录下元素出现的次数
   */
  /** @type {number[]} 结果 */
  let ans = [],
    /** @type {number[]} 元素出现的次数 */
    list = new Array(101).fill(0);

  /**
   * @param {number[]} num
   */
  function helper(num) {
    let hash = new Set();

    for (const n of num) {
      if (hash.has(n)) continue;

      hash.add(n);

      list[n]++;
    }
  }

  helper(nums1);
  helper(nums2);
  helper(nums3);

  for (let i = 1; i < list.length; i++) {
    if (list[i] > 1) {
      ans.push(i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,3,2]\n[2,3]\n[3]\n
// @lcpr case=end

// @lcpr case=start
// [3,1]\n[2,3]\n[1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2]\n[4,3,3]\n[5]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=961 lang=javascript
 * @lcpr version=30204
 *
 * [961] 在长度 2N 的数组中找出重复 N 次的元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function (nums) {
  let hash = new Set();
  for (const n of nums) {
    if (hash.has(n)) return n;

    hash.add(n);
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,2,5,3,2]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,5,2,5,3,5,4]\n
// @lcpr case=end

 */

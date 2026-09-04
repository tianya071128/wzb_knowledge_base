/*
 * @lc app=leetcode.cn id=2006 lang=javascript
 * @lcpr version=30204
 *
 * [2006] 差的绝对值为 K 的数对数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var countKDifference = function (nums, k) {
  /** @type {number} 结果 */
  let ans = 0,
    /** @type {Map<number, number>} 哈希表, 记录数字的次数 */
    hash = new Map();

  for (let i = 0; i < nums.length; i++) {
    let n = nums[i];

    ans += (hash.get(n + k) ?? 0) + (hash.get(n - k) ?? 0);

    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,3]\n3\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1,5,4]\n2\n
// @lcpr case=end

 */

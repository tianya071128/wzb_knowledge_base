/*
 * @lc app=leetcode.cn id=1512 lang=javascript
 * @lcpr version=30204
 *
 * [1512] 好数对的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var numIdenticalPairs = function (nums) {
  let hash = new Map();
  for (const n of nums) {
    hash.set(n, (hash.get(n) ?? -1) + 1);
  }

  let ans = 0;
  for (const n of hash.values()) {
    ans += (n * (n + 1)) / 2;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,1,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

 */

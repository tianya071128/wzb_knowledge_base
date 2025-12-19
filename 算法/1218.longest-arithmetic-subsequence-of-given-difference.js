/*
 * @lc app=leetcode.cn id=1218 lang=javascript
 * @lcpr version=30204
 *
 * [1218] 最长定差子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} difference
 * @return {number}
 */
var longestSubsequence = function (arr, difference) {
  /**
   * 动态规划: f(i) = Hash(arr[i] - difference) ?? 0 + 1
   */
  let hash = new Map(),
    ans = 0;

  for (const n of arr) {
    let len = (hash.get(n - difference) ?? 0) + 1;

    ans = Math.max(len, ans);
    hash.set(n, len);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,3,5,7]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,5,7,8,5,3,4,2,1]\n-2\n
// @lcpr case=end

 */

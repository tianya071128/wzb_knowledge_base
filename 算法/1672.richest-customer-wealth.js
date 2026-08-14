/*
 * @lc app=leetcode.cn id=1672 lang=javascript
 * @lcpr version=30204
 *
 * [1672] 最富有客户的资产总量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} accounts
 * @return {number}
 */
var maximumWealth = function (accounts) {
  let ans = 0;
  for (const account of accounts) {
    ans = Math.max(
      ans,
      account.reduce((total, item) => total + item)
    );
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3],[3,2,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,5],[7,3],[3,5]]\n
// @lcpr case=end

// @lcpr case=start
// [[2,8,7],[7,1,3],[1,9,5]]\n
// @lcpr case=end

 */

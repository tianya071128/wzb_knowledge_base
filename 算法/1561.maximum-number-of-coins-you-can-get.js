/*
 * @lc app=leetcode.cn id=1561 lang=javascript
 * @lcpr version=30204
 *
 * [1561] 你可以获得的最大硬币数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} piles
 * @return {number}
 */
var maxCoins = function (piles) {
  // 贪心: 每次拿出最大的二堆和最小的一堆, 自己区次大的
  piles.sort((a, b) => b - a);

  let ans = 0;
  for (let i = 0; i < piles.length / 3; i++) {
    ans += piles[i * 2 + 1];
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxCoins
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [2,4,1,2,7,8]\n
// @lcpr case=end

// @lcpr case=start
// [2,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [9,8,7,6,5,1,2,3,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxCoins;
// @lcpr-after-debug-end

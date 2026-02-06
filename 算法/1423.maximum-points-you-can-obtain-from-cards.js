/*
 * @lc app=leetcode.cn id=1423 lang=javascript
 * @lcpr version=30204
 *
 * [1423] 可获得的最大点数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} cardPoints
 * @param {number} k
 * @return {number}
 */
var maxScore = function (cardPoints, k) {
  /**
   * 前缀和: 正序和反序
   *  - 如果从左边去 n 个, 那么右边就要取 k - n 个
   */
  let prefixSum = [0],
    reversionPrefixSum = [0],
    ans = 0;
  for (let i = 0; i < cardPoints.length; i++) {
    prefixSum.push(prefixSum.at(-1) + cardPoints[i]);
    reversionPrefixSum.push(
      reversionPrefixSum.at(-1) + cardPoints[cardPoints.length - i - 1]
    );
  }

  for (let i = k; i >= 0; i--) {
    ans = Math.max(prefixSum[i] + reversionPrefixSum[k - i], ans);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxScore
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,4,5,6,1]\n3\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2]\n2\n
// @lcpr case=end

// @lcpr case=start
// [9,7,7,9,7,7,9]\n7\n
// @lcpr case=end

// @lcpr case=start
// [1,1000,1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,79,80,1,1,1,200,1]\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxScore;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=1710 lang=javascript
 * @lcpr version=30204
 *
 * [1710] 卡车上的最大单元数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} boxTypes
 * @param {number} truckSize
 * @return {number}
 */
var maximumUnits = function (boxTypes, truckSize) {
  /** 贪心: 先装单元大的箱子 */

  /** @type {number} 结果 */
  let ans = 0;

  boxTypes.sort((a, b) => b[1] - a[1]);

  for (const [i, j] of boxTypes) {
    if (truckSize <= 0) break;

    ans += j * Math.min(truckSize, i);
    truckSize -= i;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,3],[2,2],[3,1]]\n4\n
// @lcpr case=end

// @lcpr case=start
// [[5,10],[2,5],[4,7],[3,9]]\n10\n
// @lcpr case=end

 */

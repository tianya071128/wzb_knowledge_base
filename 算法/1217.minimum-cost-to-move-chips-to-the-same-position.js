/*
 * @lc app=leetcode.cn id=1217 lang=javascript
 * @lcpr version=30204
 *
 * [1217] 玩筹码
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} position
 * @return {number}
 */
var minCostToMoveChips = function (position) {
  /**
   * 奇数和偶数的位置相互移动无代价
   *
   *  - 统计奇数和偶数位置上的筹码个数
   *  - 哪个比较少就移动一隔
   */
  let oddSum = 0,
    evenSum = 0;

  for (const n of position) {
    if (n % 2 === 0) {
      evenSum++;
    } else {
      oddSum++;
    }
  }

  return Math.min(oddSum, evenSum);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,1000000000]\n
// @lcpr case=end

 */

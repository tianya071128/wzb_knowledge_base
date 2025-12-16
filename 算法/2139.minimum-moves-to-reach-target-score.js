/*
 * @lc app=leetcode.cn id=2139 lang=javascript
 * @lcpr version=30204
 *
 * [2139] 得到目标值的最少行动次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} target
 * @param {number} maxDoubles
 * @return {number}
 */
var minMoves = function (target, maxDoubles) {
  /**
   * 贪心: 从目标倒推, 越大的值, 则越优先使用翻倍
   */
  let ans = 0;
  while (target > 1) {
    // 只能使用递增
    if (maxDoubles === 0) {
      ans += target - 1;
      target = 1;
    } else {
      ans += 1 + (target % 2);
      target = Math.floor(target / 2);
      maxDoubles--;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minMoves
// paramTypes= ["number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 5\n0\n
// @lcpr case=end

// @lcpr case=start
// 1612\n2\n
// @lcpr case=end

// @lcpr case=start
// 10\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minMoves;
// @lcpr-after-debug-end

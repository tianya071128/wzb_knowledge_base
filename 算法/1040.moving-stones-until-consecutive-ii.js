/*
 * @lc app=leetcode.cn id=1040 lang=javascript
 * @lcpr version=30204
 *
 * [1040] 移动石子直到连续 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} stones
 * @return {number[]}
 */
var numMovesStonesII = function (stones) {
  /**
   * 最大: 必须要舍去一个左右的间隙, 其他的可以交替放在间隙中, 保证每一个间隙都能够填满
   *  最右端石头 - 最左端石头 + 1 - stones.length - Math.min(最左侧石头间隙, 最右侧石头间隙)
   *
   * 最小: 滑动窗口
   *  当窗口的空隙能够容纳其他石头时, 此时
   *    - 当空隙正好为其他石头的数量时, 那么移动次数就是其他石头的数量
   *    - 当空隙大于其他石头的数量时, 那么移动次数就是其他石头的数量 + 1
   */
  stones.sort((a, b) => a - b);

  let max =
      stones.at(-1) -
      stones[0] +
      1 -
      stones.length -
      Math.min(stones.at(-1) - stones.at(-2) - 1, stones[1] - stones[0] - 1),
    min = Infinity;

  // 滑动窗口确定最小值
  let left = 0,
    right = 1;
  while (right < stones.length && left < right) {
    // 窗口空隙不够放, 往右扩展区间
    if (stones[right] - stones[left] + 1 < stones.length) {
      right++;
    }
    // 正好够放
    else if (stones[right] - stones[left] + 1 === stones.length) {
      min = Math.min(min, stones.length - (right - left + 1));
      left++;
      right++;
    }
    // 空隙大于其他石头的数量
    else {
      min = Math.min(min, Math.max(2, stones.length - (right - left + 1) + 1));
      left++;
      left === right && right++;
    }
  }

  return [min, max];
};
// @lc code=end

/*
// @lcpr case=start
// [7,4,9]\n
// @lcpr case=end

// @lcpr case=start
// [2, 3, 4, 5, 50, 51, 52, 53, 70, 71, 72]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numMovesStonesII;
// @lcpr-after-debug-end

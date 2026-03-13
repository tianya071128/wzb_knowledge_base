/*
 * @lc app=leetcode.cn id=42 lang=javascript
 * @lcpr version=30204
 *
 * [42] 接雨水
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  /**
   * 根据题意可得
   *  - height 划分为柱状图后, 存在峰值和谷值
   *  - 雨水量就是每个 Math.min(右峰值 - 左峰值) - 谷值
   *  - 通过三个指针来查找峰值和谷值
   */
  // 在尾部增加0, 方便计算
  height.push(0);

  let leftPeak, // 左峰值
    valley, // 谷值
    prev = 0, // 上一个值
    middle = height[0], // 中间值
    ans = 0; // 结果

  for (let i = 1; i < height.length; i++) {
    let next = height[i];

    // 如果当前值与上一个值相同, 则不做处理
    if (next === middle) continue;

    // 根据三个值, 来判断 middle 是否为峰值或者谷值
    // 峰值
    if (middle > prev && middle > next) {
      // 如果左侧峰值, 则追加结果
      if (leftPeak != null) {
        ans += Math.min(leftPeak, middle) - valley;
      }

      // 重置变量
      leftPeak = middle;
      valley = undefined;
    }
    // 谷值
    else if (middle < prev && middle < next) {
      valley = middle;
    }

    // 重置指针
    [prev, middle] = [middle, next];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,0,2,1,0,1,3,2,1,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,0,3,2,5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = trap;
// @lcpr-after-debug-end

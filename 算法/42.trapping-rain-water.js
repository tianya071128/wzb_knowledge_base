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
   *  - height 划分为柱状图后, 存在峰值
   *  - 通过三个指针来查找峰值
   *  - 通过栈保存峰值的索引
   *     - 如果峰值之间存在比谷底, 那么需要将谷抹平
   *     - e.g: [5,4,6] --> 那么峰值 4 就没有意义
   */
  // 在尾部增加0, 方便计算
  height.push(0);

  let prev = 0, // 上一个值
    middleIndex = 0, // 中间值
    stack = [], // 峰值栈
    max = -1; // 峰值栈中最大值

  for (let i = 1; i < height.length; i++) {
    let next = height[i],
      middle = height[middleIndex];

    // 如果当前值与上一个值相同, 则不做处理
    if (next === middle) continue;

    // 根据三个值, 来判断 middle 是否为峰值或者谷值
    // 峰值
    if (middle > prev && middle > next) {
      // 将谷抹平
      while (
        stack.length > 1 &&
        height[stack.at(-1)] < middle &&
        height[stack.at(-1)] < max
      ) {
        // 当前项去除
        stack.pop();
      }

      stack.push(middleIndex);
      max = Math.max(max, middle);
    }

    // 重置指针
    prev = middle;
    middleIndex = i;
  }

  // 根据峰值来计算雨水量
  let ans = 0;
  for (let i = 0; i < stack.length - 1; i++) {
    let base = Math.min(height[stack[i]], height[stack[i + 1]]);

    // 两个峰值之间的可以接住雨水
    for (let j = stack[i] + 1; j < stack[i + 1]; j++) {
      ans += Math.max(base - height[j], 0);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,0,2,1,0,1,3,2,1,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,0,3,2,5,10,4,2,0,100,3,2,5,10,4,2,0,3,2,5,10]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = trap;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=739 lang=javascript
 * @lcpr version=30204
 *
 * [739] 每日温度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
  /**
   * 单调递减栈:
   *  维护两个栈:
   *   a. 该栈维护递减栈, 如果碰到不满足递减的, 那么就执行出栈
   *   b. 该栈维护上一个栈对应的索引
   */
  let ans = new Array(temperatures.length).fill(0),
    stock1 = [], // 单调递减栈
    stock2 = []; // 索引栈

  for (let i = 0; i < temperatures.length; i++) {
    const item = temperatures[i];

    // 执行出栈处理
    while (stock1.length && item > stock1.at(-1)) {
      stock1.pop();
      const prevIndex = stock2.pop();
      ans[prevIndex] = i - prevIndex;
    }

    stock1.push(item);
    stock2.push(i);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [73,74,75,71,69,72,76,73]\n
// @lcpr case=end

// @lcpr case=start
// [30,40,50,60]\n
// @lcpr case=end

// @lcpr case=start
// [30,60,90]\n
// @lcpr case=end

 */

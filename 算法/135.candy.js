/*
 * @lc app=leetcode.cn id=135 lang=javascript
 * @lcpr version=30204
 *
 * [135] 分发糖果
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
  /**
   * 首先找到肯定是 1 的项
   */
  let ans = [];

  // 首尾增加项偏于计算
  ratings.unshift(Infinity);
  ratings.push(Infinity);

  for (let i = 1; i < ratings.length - 1; i++) {
    // 待定项 - 不能确定发放数量
    if (ratings[i] > ratings[i + 1]) {
      ans.push(0); // 以 0 暂位
    } else {
      ans.push(ratings[i] > ratings[i - 1] ? (ans.at(-1) ?? 0) + 1 : 1);

      // 往前遍历 0 的项
      for (let j = ans.length - 2; j >= 0; j--) {
        if (ans[j] !== 0) break;

        if (ratings[j + 1] > ratings[j]) {
          ans[j] = Math.max(ans[j + 1], ans[j - 1] ?? 0) + 1;
        } else {
          ans[j] = ans[j + 1] + 1;
        }
      }
    }
  }

  return ans.reduce((total, item) => total + item);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,62,7,8,9,10,10,130,62,7,8,9,10,10,130,62,7,8,9,10,10,130,5,62,7,8,9,10,10,130,9]\n
// @lcpr case=end

// @lcpr case=start
// [29,51,87,87,72,12]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = candy;
// @lcpr-after-debug-end

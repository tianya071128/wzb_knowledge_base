/*
 * @lc app=leetcode.cn id=1414 lang=javascript
 * @lcpr version=30204
 *
 * [1414] 和为 K 的最少斐波那契数字数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} k
 * @return {number}
 */
var findMinFibonacciNumbers = function (k) {
  /**
   * 贪心: 取最接近 k 的值的
   */
  // 计算斐波那契
  let list = [1, 1],
    sum;
  while ((sum = list.at(-1) + list.at(-2)) <= k) {
    list.push(sum);
  }

  let ans = 0,
    i = list.length;
  while (k > 0) {
    if (list[i] <= k) {
      ans++;
      k -= list[i];
    }

    i--;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 1564856\n
// @lcpr case=end

// @lcpr case=start
// 19\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1317 lang=javascript
 * @lcpr version=30204
 *
 * [1317] 将整数转换为两个无零整数的和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number[]}
 */
var getNoZeroIntegers = function (n) {
  for (let i = 1; i < n; i++) {
    if (helper(i) && helper(n - i)) return [i, n - i];
  }
};

/**
 * 检测是否为无零整数
 * @param {number} n
 */
function helper(n) {
  while (n > 0) {
    if (n % 10 === 0) return false;

    n = Math.floor(n / 10);
  }

  return true;
}
// @lc code=end

/*
// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 1564\n
// @lcpr case=end

// @lcpr case=start
// 10000\n
// @lcpr case=end

// @lcpr case=start
// 69\n
// @lcpr case=end

// @lcpr case=start
// 1010\n
// @lcpr case=end

 */

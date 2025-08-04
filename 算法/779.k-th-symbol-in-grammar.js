/*
 * @lc app=leetcode.cn id=779 lang=javascript
 * @lcpr version=30204
 *
 * [779] 第K个语法符号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var kthGrammar = function (n, k) {
  /**
   * 1. 根据 k 递推上一行的数字，索引为：Math.ceil(k / 2) 的数字
   * 2. 得到上一行数字后，判断当行在上一行分裂后的位置来判断当前数字
   */
  if (n === 1) return 0;

  const prevNum = kthGrammar(n - 1, Math.ceil(k / 2));

  if (k % 2 === 0) return prevNum === 0 ? 1 : 0;

  return prevNum;
};
// @lc code=end

/*
// @lcpr case=start
// 30\n1\n
// @lcpr case=end

// @lcpr case=start
// 2\n1\n
// @lcpr case=end

// @lcpr case=start
// 2\n2\n
// @lcpr case=end

 */

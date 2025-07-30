/*
 * @lc app=leetcode.cn id=728 lang=javascript
 * @lcpr version=30204
 *
 * [728] 自除数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} left
 * @param {number} right
 * @return {number[]}
 */
var selfDividingNumbers = function (left, right) {
  /** 暴力, 直接处理 */
  function helper(n) {
    let n1 = n;

    while (n1) {
      let cur = n1 % 10;

      if (cur === 0 || n % cur !== 0) return false;

      n1 = Math.floor(n1 / 10);
    }

    return true;
  }

  let ans = [];
  for (let i = left; i <= right; i++) {
    if (helper(i)) ans.push(i);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n10000\n
// @lcpr case=end

// @lcpr case=start
// 47\n85\n
// @lcpr case=end

 */

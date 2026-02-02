/*
 * @lc app=leetcode.cn id=1387 lang=javascript
 * @lcpr version=30204
 *
 * [1387] 将整数按权重排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} lo
 * @param {number} hi
 * @param {number} k
 * @return {number}
 */
var getKth = function (lo, hi, k) {
  let ans = [];

  // 计算权重
  let cache = new Map();
  function helper(i) {
    if (cache.has(i)) return cache.get(i);

    // 如果是 2 的指数的话, 直接返回
    let n = Math.log2(i);
    if (!Number.isInteger(n)) {
      n = helper(i % 2 === 0 ? i / 2 : i * 3 + 1) + 1;
    }

    cache.set(i, n);
    return n;
  }

  for (; lo <= hi; lo++) {
    ans.push([lo, helper(lo)]);
  }

  return ans.sort((a, b) => (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]))[
    k - 1
  ][0];
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=getKth
// paramTypes= ["number","number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 1\n1000\n2\n
// @lcpr case=end

// @lcpr case=start
// 7\n11\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getKth;
// @lcpr-after-debug-end

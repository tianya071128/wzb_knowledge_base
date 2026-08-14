/*
 * @lc app=leetcode.cn id=1652 lang=javascript
 * @lcpr version=30204
 *
 * [1652] 拆炸弹
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} code
 * @param {number} k
 * @return {number[]}
 */
var decrypt = function (code, k) {
  if (k === 0) return new Array(code.length).fill(0);

  /** @type {number[]} 前缀和 */
  let prefixSum = [],
    /** @type {number[]} 结果 */
    ans = [],
    /** @type {number} 原始 code 长度 */
    len = code.length;

  /** 拼接一个数组 code 到原 code, 快速解决循环问题 */
  code.push(...code);
  code.unshift(...code);

  for (const item of code) {
    prefixSum.push(item + (prefixSum.at(-1) ?? 0));
  }

  for (let i = len; i < len * 2; i++) {
    if (k > 0) {
      ans.push(prefixSum[i + k] - prefixSum[i]);
    } else {
      ans.push(prefixSum[i - 1] - (prefixSum[i + k - 1] ?? 0));
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,7,1,4]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n0\n
// @lcpr case=end

// @lcpr case=start
// [2,4,9,3]\n-2\n
// @lcpr case=end

 */

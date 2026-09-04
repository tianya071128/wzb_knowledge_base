/*
 * @lc app=leetcode.cn id=1991 lang=javascript
 * @lcpr version=30204
 *
 * [1991] 找到数组的中间位置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMiddleIndex = function (nums) {
  /** @type {number[]} 前缀和 */
  let prefixSum = [0];

  for (const n of nums) {
    prefixSum.push(prefixSum.at(-1) + n);
  }

  prefixSum.push(prefixSum.at(-1));

  for (let i = 1; i < prefixSum.length - 1; i++) {
    if (prefixSum[i - 1] === prefixSum.at(-1) - prefixSum[i]) return i - 1;
  }

  return -1;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=findMiddleIndex
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,-1,4]\n
// @lcpr case=end

// @lcpr case=start
// [2,5]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findMiddleIndex;
// @lcpr-after-debug-end

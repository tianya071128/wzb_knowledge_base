/*
 * @lc app=leetcode.cn id=873 lang=javascript
 * @lcpr version=30204
 *
 * [873] 最长的斐波那契子序列的长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var lenLongestFibSubseq = function (arr) {
  /**
   * 只要确定开头两个元素就可以知道后续元素
   */
  let hash = new Set(arr),
    ans = 0;
  for (let i = 0; i < arr.length - 2; i++) {
    for (let j = i + 1; j < arr.length - 1; j++) {
      let one = arr[i],
        two = arr[j],
        n = 2;
      while (hash.has(one + two)) {
        n++;
        // one = two;
        // two = one + two;
        [one, two] = [two, one + two];
      }

      if (n >= 3) ans = Math.max(ans, n);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7,8]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,7,11,12,14,18]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = lenLongestFibSubseq;
// @lcpr-after-debug-end

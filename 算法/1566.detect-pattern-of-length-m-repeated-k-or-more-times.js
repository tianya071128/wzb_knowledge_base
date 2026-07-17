/*
 * @lc app=leetcode.cn id=1566 lang=javascript
 * @lcpr version=30204
 *
 * [1566] 重复至少 K 次且长度为 M 的模式
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} m
 * @param {number} k
 * @return {boolean}
 */
var containsPattern = function (arr, m, k) {
  for (
    let patternStart = 0;
    patternStart < arr.length - m * k;
    patternStart++
  ) {
    /** @type {number} 当次区间下匹配次数 */
    let n = 0;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,4,4,4,4]\n1\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,1,2,1,1,1,3]\n2\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,2,1,2,1,3]\n2\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,1,2]\n2\n2\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,2]\n2\n3\n
// @lcpr case=end

 */

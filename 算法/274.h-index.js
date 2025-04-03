/*
 * @lc app=leetcode.cn id=274 lang=javascript
 * @lcpr version=30204
 *
 * [274] H 指数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function (citations) {
  // 1. 先排序
  citations.sort((a, b) => a - b);

  for (let i = 1; i <= citations.length; i++) {
    // 判断当 H 指数为 i 时, 是否有 i 篇文档被引用小于 i, 此时说明条件不成立, 返回上一次值
    // 因为是已排序的数组, 那么直接判断即可
    if (citations[citations.length - i] < i) return i - 1;
  }
  return citations.length;
};
// @lc code=end

/*
// @lcpr case=start
// [5,0,6,1,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = hIndex;
// @lcpr-after-debug-end

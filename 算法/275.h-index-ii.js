/*
 * @lc app=leetcode.cn id=275 lang=javascript
 * @lcpr version=30204
 *
 * [275] H 指数 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function (citations) {
  // 对数时间复杂度 - 双指针
  let left = 0,
    right = citations.length;
  while (left < right) {
    const mid = Math.floor((right - left) / 2) + left;
    // 转换到 mid 对应在 citations 的索引
    // 例如: mid = 2, 那么只要 citations.at(-2) 倒数第二个元素的引用
    //    大于等于 2, 那么说明 H 值 >= 2, 在右区间
    //    反之, 则在左区间
    if (citations.at(-1 * mid) >= mid) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left === 0 || citations.at(-1 * left) >= left ? left : left - 1;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,3,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,100]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = hIndex;
// @lcpr-after-debug-end

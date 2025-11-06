/*
 * @lc app=leetcode.cn id=1007 lang=javascript
 * @lcpr version=30204
 *
 * [1007] 行相等的最少多米诺旋转
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} tops
 * @param {number[]} bottoms
 * @return {number}
 */
var minDominoRotations = function (tops, bottoms) {
  /**
   * 1. 遍历的过程, 判定哪个数字在两个数组同一个索引中都存在
   * 2. 记录下每个元素的个数, 用于判断最小旋转次数
   */
  let hash = new Map(),
    hash2 = new Map(),
    hash3 = new Set(), // 满足条件的数字
    ans = Infinity;
  for (let i = 0; i < tops.length; i++) {
    if (!hash3.size) {
      hash3.add(tops[i]);
      hash3.add(bottoms[i]);
    } else {
      // 判断这两个数字是否在该列中存在
      for (const n of hash3) {
        if (n !== tops[i] && n !== bottoms[i]) {
          hash3.delete(n);
        }
      }

      // 如果没有符合条件的数字, 直接判定为无法做到
      if (!hash3.size) return -1;
    }

    hash.set(tops[i], (hash.get(tops[i]) ?? 0) + 1);
    hash2.set(bottoms[i], (hash2.get(bottoms[i]) ?? 0) + 1);
  }

  // 判断最小旋转次数
  for (const n of hash3) {
    // 在 top 和 bottom 中各自判断一下
    ans = Math.min(ans, tops.length - (hash.get(n) ?? 0));
    ans = Math.min(ans, bottoms.length - (hash2.get(n) ?? 0));
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n[4,4,4]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,1,1]\n[1,1,2,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minDominoRotations;
// @lcpr-after-debug-end

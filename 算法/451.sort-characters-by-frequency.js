/*
 * @lc app=leetcode.cn id=451 lang=javascript
 * @lcpr version=30204
 *
 * [451] 根据字符出现频率排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化空间:
 *  遍历字符串时, 记录字符的最高频率 maxFreq
 *  在桶排序时就可以使用最高频率而减少桶
 * @param {string} s
 * @return {string}
 */
var frequencySort = function (s) {
  /** 先使用 hash 表计算字符数量 */
  let hash = new Map();

  for (const item of s) {
    hash.set(item, (hash.get(item) ?? 0) + 1);
  }

  /**
   * 桶排序:
   *  以出现数量来进行排序, 空间是否会过大?
   */
  const bucket = new Array(Math.ceil(s.length) + 1).fill(0).map((item) => []);
  hash.forEach((v, k) => bucket[v].push(k));

  // 组装成字符
  return bucket.reduceRight(
    (total, item, index) =>
      total + item.reduce((total, sub) => total + sub.repeat(index), ''),
    ''
  );
};
// @lc code=end

/*
// @lcpr case=start
// "eeeee"\n
// @lcpr case=end

// @lcpr case=start
// "cccaaa"\n
// @lcpr case=end

// @lcpr case=start
// "Aabb"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = frequencySort;
// @lcpr-after-debug-end

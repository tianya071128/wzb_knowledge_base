/*
 * @lc app=leetcode.cn id=763 lang=javascript
 * @lcpr version=30204
 *
 * [763] 划分字母区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
  /**
   * 1. 使用 hash 记录下每个字符的最大索引
   * 2. 遍历字符, 同时扩展最大右边界, 直至到达区间内最大右边界记录一个字符
   */
  let hash = new Map(),
    ans = [];

  for (let i = 0; i < s.length; i++) {
    hash.set(s[i], Math.max(hash.get(s[i]) ?? 0, i));
  }

  let r = 0, // 右边界索引
    start = 0; // 起始索引
  for (let i = 0; i < s.length; i++) {
    // 更新右边界
    r = Math.max(r, hash.get(s[i]));

    // 如果已经是右边界, 满足条件
    if (i === r) {
      ans.push(r - start + 1);

      start = ++r;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "ababcbacadefegdehijhklij"\n
// @lcpr case=end

// @lcpr case=start
// "eccbbbbdec"\n
// @lcpr case=end

 */

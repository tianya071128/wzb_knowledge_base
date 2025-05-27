/*
 * @lc app=leetcode.cn id=438 lang=javascript
 * @lcpr version=30204
 *
 * [438] 找到字符串中所有字母异位词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  /**
   * 异位词: 字符和数量相同, 只是位置不同
   *  1. 计算出 p 的字符和数量
   *  2. 滑动窗口, 窗口固定大小为 p.length
   *      - 计算窗口中的字符的数量, 是否与 p 的匹配  --> 所以难点在于: 如何快速比较两个字符的数量和大小
   *      - 向右滑动窗口, 重新计算
   */
  let ans = [],
    left = 0,
    right = p.length - 1,
    pMap = new Map();

  // 计算出 p 的字符和数量
  for (const item of p) {
    pMap.set(item, (pMap.get(item) ?? 0) + 1);
  }

  // 计算初始窗口的字符和数量
  let sMap = new Map();
  for (let i = left; i <= right; i++) {
    sMap.set(s[i], (sMap.get(s[i]) ?? 0) + 1);
  }

  while (right < s.length) {
    // 检测窗口内的字符是否为异位词
    if ([...pMap].every(([k, v]) => sMap.get(k) === v)) ans.push(left);

    // 滑动窗口
    sMap.set(s[left], sMap.get(s[left]) - 1); // 左边字符 - 1
    left++;
    right++;
    sMap.set(s[right], (sMap.get(s[right]) ?? 0) + 1); // 新加入的窗口字符 + 1
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "cbaebabacd"\n"abc"\n
// @lcpr case=end

// @lcpr case=start
// "abab"\n"ab"\n
// @lcpr case=end

 */

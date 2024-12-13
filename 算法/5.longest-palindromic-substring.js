/*
 * @lc app=leetcode.cn id=5 lang=javascript
 * @lcpr version=30204
 *
 * [5] 最长回文子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
// 辅助函数 -- 检测是否为回文字符串
function check(s) {
  for (let index = 0; index < Math.floor(s.length / 2); index++) {
    if (s[index] !== s[s.length - 1 - index]) return false;
  }
  return true;
}
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  // // 长度为 1 时, 就是本身
  if (s.length <= 1) return s;
  // /**
  //  * 解题思路:
  //  *  1. 从最长的子串开始，遍历所有该原字符串的子串
  //  *  2. 每找出一个字符串，就判断该字符串是否为回文
  //  *  3. 如果是, 直接返回, 否则继续遍历
  //  */
  // // 最长的子串是当前字符串大小开始, 最少要两个字符串才去比较
  // for (let i = s.length; i > 1; i--) {
  //   for (let j = 0; j < s.length - i + 1; j++) {
  //     const sub = s.slice(j, j + i);
  //     if (check(sub)) return sub;
  //   }
  // }
  // // 没有一个子串为回文时, 则取第一个
  // return s[0];
  /**
   * 优化版: https://leetcode.cn/problems/longest-palindromic-substring/solutions/697935/chao-jian-dan-de-zhong-xin-kuo-san-fa-yi-qini/
   * 中心扩散法
   *  循环遍历字符串 对取到的每个值 都假设他可能成为最后的中心进行判断, 回文字符串可能有两种情况:
   *    - 一种是回文子串长度为奇数（如aba，中心是b）
   *    - 另一种回文子串长度为偶数（如abba，中心是b，b）
   */
  let res = '';
  // 优化1: 使用指针代替子串, 避免每次都截取字符串
  let l = (r = 0);
  function helper(m, n) {
    // m, n 要在边界中 并且 对应的字符相等
    // 满足条件, 向左右两边进一位
    while (m >= 0 && n <= s.length - 1 && s[m] === s[n]) {
      m--;
      n++;
    }

    // 优化2: 条件判断
    if (n - m > r - l) {
      r = n;
      l = m;
    }
  }

  for (let i = 0; i < s.length; i++) {
    // 回文子串长度是奇数
    helper(i, i);
    // 回文子串长度是偶数
    helper(i, i + 1);
  }

  return s.slice(l + 1, r);
};
// @lc code=end

/*
// @lcpr case=start
// "babad"\n
// @lcpr case=end

// @lcpr case=start
// "cbbd"\n
// @lcpr case=end

 */

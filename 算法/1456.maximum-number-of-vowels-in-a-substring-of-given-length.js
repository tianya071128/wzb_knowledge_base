/*
 * @lc app=leetcode.cn id=1456 lang=javascript
 * @lcpr version=30204
 *
 * [1456] 定长子串中元音的最大数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var maxVowels = function (s, k) {
  // 滑动窗口
  let l = 0,
    r = -1,
    ans = 0,
    hash = new Set(['a', 'e', 'i', 'o', 'u']);

  // 初始窗口
  while (r < k - 1) {
    r++;
    if (hash.has(s[r])) ans++;
  }

  // 滑动
  let cur = ans;
  while (r < s.length - 1) {
    if (hash.has(s[++r])) cur++;
    if (hash.has(s[l++])) cur--;

    ans = Math.max(cur, ans);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxVowels
// paramTypes= ["string","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abciiidef"\n3\n
// @lcpr case=end

// @lcpr case=start
// "aeiou"\n2\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n3\n
// @lcpr case=end

// @lcpr case=start
// "rhythms"\n4\n
// @lcpr case=end

// @lcpr case=start
// "tryhard"\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxVowels;
// @lcpr-after-debug-end

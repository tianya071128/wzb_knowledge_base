/*
 * @lc app=leetcode.cn id=1624 lang=javascript
 * @lcpr version=30204
 *
 * [1624] 两个相同字符之间的最长子字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var maxLengthBetweenEqualCharacters = function (s) {
  /** @type {Map<string, number>} 使用哈希表记录同一个字符第一次的索引 */
  let hash = new Map(),
    /** @type {number} 结果 */
    ans = -1;

  for (let i = 0; i < s.length; i++) {
    let str = s[i];

    if (hash.has(str)) {
      ans = Math.max(ans, i - hash.get(str) - 1);
    } else {
      hash.set(str, i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "mgntdygtxrvxjnwksqhxuxtrv"\n
// @lcpr case=end

// @lcpr case=start
// "abca"\n
// @lcpr case=end

// @lcpr case=start
// "cbzxy"\n
// @lcpr case=end

// @lcpr case=start
// "cabbac"\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1297 lang=javascript
 * @lcpr version=30204
 *
 * [1297] 子串的最大出现次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} maxLetters
 * @param {number} minSize
 * @param {number} maxSize
 * @return {number}
 */
var maxFreq = function (s, maxLetters, minSize, maxSize) {
  /**
   * 1. 根据 maxLetters 滑动窗口找到满足的最大子串
   * 2. 在根据 minSize, maxSize 来判断子串
   */
  let hash = new Map(),
    /** @type {Set<String>} 防止重复子串计算结果 */
    subIndexHash = new Set();

  // 滑动窗口
  /** @type {Map<string, number>} 窗口的字母大小 */
  let hash2 = new Map(),
    l = 0,
    r = -1,
    ans = 0;

  while (r < s.length) {
    // 收缩左区间
    while (l < r && hash2.size > maxLetters) {
      let item = s[l];
      if (hash2.get(item) === 1) {
        hash2.delete(item);
      } else {
        hash2.set(item, hash2.get(item) - 1);
      }

      l++;
    }

    // 扩展右区间
    while (
      r + 1 < s.length &&
      hash2.size + (hash2.has(s[r + 1]) ? 0 : 1) <= maxLetters
    ) {
      r++;
      hash2.set(s[r], (hash2.get(s[r]) ?? 0) + 1);
    }

    if (r - l + 1 >= minSize) {
      for (let i = l; i <= r - minSize + 1; i++) {
        let sub = '';
        for (let j = i; j < i + minSize; j++) {
          sub += s[j];

          if (sub.length >= minSize && !subIndexHash.has(`${i}${j}`)) {
            let n = (hash.get(sub) ?? 0) + 1;
            hash.set(sub, n);
            subIndexHash.add(`${i}${j}`);

            ans = Math.max(n, ans);
          }
        }
      }
    }

    // 移动右区间
    r++;
    hash2.set(s[r], (hash2.get(s[r]) ?? 0) + 1);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxFreq
// paramTypes= ["string","number","number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "bccaabac"\n2\n2\n2\n
// @lcpr case=end

// @lcpr case=start
// "aaaa"\n1\n3\n3\n
// @lcpr case=end

// @lcpr case=start
// "aabcabcab"\n2\n2\n3\n
// @lcpr case=end

// @lcpr case=start
// "abcde"\n2\n3\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxFreq;
// @lcpr-after-debug-end

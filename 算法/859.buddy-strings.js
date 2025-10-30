/*
 * @lc app=leetcode.cn id=859 lang=javascript
 * @lcpr version=30204
 *
 * [859] 亲密字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var buddyStrings = function (s, goal) {
  /**
   * 题意得知:
   *  1. 如果字符相同, 那么只要存在重复字符就满足条件
   *  2. 如果字符不同, 则只要不同字符的数量为 2, 并且不同字符两边相同则满足条件
   */
  if (s.length !== goal.length) return false;

  let isRepeat = false, // 是否存在重复字符
    hash = new Set(), // 字符哈希, 用于判断是否存在重复字符
    diffs = []; // 不同字符索引

  for (let i = 0; i < s.length; i++) {
    if (!isRepeat) {
      if (hash.has(s[i])) {
        isRepeat = true;
      } else {
        hash.add(s[i]);
      }
    }

    // 检测是否不同
    if (s[i] !== goal[i]) {
      diffs.push(i);

      if (diffs.length === 2) {
        if (s[diffs[0]] !== goal[diffs[1]] || s[diffs[1]] !== goal[diffs[0]])
          return false;
      } else if (diffs.length > 2) return false;
    }
  }

  // 字符相同时, 则判断是否存在重复字符
  if (!diffs.length) {
    return isRepeat;
  } else {
    return diffs.length === 2;
  }
};
// @lc code=end

/*
// @lcpr case=start
// "ab"\n"ba"\n
// @lcpr case=end

// @lcpr case=start
// "ab"\n"ab"\n
// @lcpr case=end

// @lcpr case=start
// "aa"\n"aa"\n
// @lcpr case=end

 */

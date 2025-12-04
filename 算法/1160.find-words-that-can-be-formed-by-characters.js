/*
 * @lc app=leetcode.cn id=1160 lang=javascript
 * @lcpr version=30204
 *
 * [1160] 拼写单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @param {string} chars
 * @return {number}
 */
var countCharacters = function (words, chars) {
  /**
   * 先计算 chars 的字符数量
   * 之后再跟 words 的字符数量比对
   */
  let ans = 0,
    charsArr = new Array(26).fill(0),
    base = 'a'.charCodeAt();

  for (const s of chars) {
    charsArr[s.charCodeAt() - base]++;
  }

  for (const word of words) {
    let cur = new Array(26).fill(0),
      flag = false;
    for (const s of word) {
      if (++cur[s.charCodeAt() - base] > charsArr[s.charCodeAt() - base]) {
        flag = true;
        break;
      }
    }

    if (!flag) ans += word.length;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["cat","bt","hat","tree"]\n"atach"\n
// @lcpr case=end

// @lcpr case=start
// ["hello","world","leetcode"]\n"welldonehoneyr"\n
// @lcpr case=end

 */

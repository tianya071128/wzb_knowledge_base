/*
 * @lc app=leetcode.cn id=1170 lang=javascript
 * @lcpr version=30204
 *
 * [1170] 比较字符串最小字母出现频次
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} queries
 * @param {string[]} words
 * @return {number[]}
 */
var numSmallerByFrequency = function (queries, words) {
  /**
   * 先计算出 words 中的频次
   *  - 因为字符最大为 10 个, 所以直接使用长度为12的数组表示
   *  - 计算出所有的之后, 使用反转的前缀和来进行存储
   */
  let codeSum = new Array(12).fill(0);
  for (const item of words) {
    codeSum[getLen(item)]++;
  }

  // 计算前缀和, 复用 codeSum
  for (let i = codeSum.length - 2; i >= 0; i--) {
    codeSum[i] = codeSum[i] + codeSum[i + 1];
  }

  for (let i = 0; i < queries.length; i++) {
    queries[i] = codeSum[getLen(queries[i]) + 1];
  }

  return queries;
};

/**
 * @param {string} word
 * @return {number}
 */
var getLen = function (word) {
  let code = Infinity, // 字典序
    ans = 0;
  for (const s of word) {
    let curCode = s.charCodeAt();
    if (curCode < code) {
      ans = 1;
      code = curCode;
    } else if (curCode === code) {
      ans++;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numSmallerByFrequency
// paramTypes= ["string[]","string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["cbd"]\n["zaaaz"]\n
// @lcpr case=end

// @lcpr case=start
// ["bbb","cc"]\n["a","aa","aaa","aaaa"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numSmallerByFrequency;
// @lcpr-after-debug-end

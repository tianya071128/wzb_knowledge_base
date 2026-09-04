/*
 * @lc app=leetcode.cn id=1974 lang=javascript
 * @lcpr version=30204
 *
 * [1974] 使用特殊打字机键入单词的最少时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word
 * @return {number}
 */
var minTimeToType = function (word) {
  word = 'a' + word;

  /**
   * 1. 只要走 26 步就是回到原点
   * 2. 所以一个字母到另一个字母有两个可能 Math.abs(x - y) 或 26 - Math.abs(x - y)
   * 3. 取最小的一种
   */
  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 1; i < word.length; i++) {
    let n = Math.abs(word[i].charCodeAt() - word[i - 1].charCodeAt());

    ans += Math.min(n, 26 - n) + 1;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minTimeToType
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abc"\n
// @lcpr case=end

// @lcpr case=start
// "bza"\n
// @lcpr case=end

// @lcpr case=start
// "zjpc"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minTimeToType;
// @lcpr-after-debug-end

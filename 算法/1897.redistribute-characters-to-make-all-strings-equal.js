/*
 * @lc app=leetcode.cn id=1897 lang=javascript
 * @lcpr version=30204
 *
 * [1897] 重新分配字符使所有字符串都相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {boolean}
 */
var makeEqual = function (words) {
  /**
   * 只要所有的字符都能平均分配就可以了
   */

  /** @type {number[]} 每个字符的数量 */
  let list = new Array(26).fill(0);

  for (const word of words) {
    for (const w of word) {
      list[w.charCodeAt() - 'a'.charCodeAt()]++;
    }
  }

  for (const n of list) {
    if (n % words.length !== 0) return false;
  }

  return true;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=makeEqual
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["aa","abaab"]\n
// @lcpr case=end

// @lcpr case=start
// ["ab","a"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = makeEqual;
// @lcpr-after-debug-end

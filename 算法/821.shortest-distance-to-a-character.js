/*
 * @lc app=leetcode.cn id=821 lang=javascript
 * @lcpr version=30204
 *
 * [821] 字符的最短距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function (s, c) {
  // 1. 记录下字符 c 在 s 中的位置
  let indexs = [],
    ans = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === c) indexs.push(i);
  }

  // 2. 在其首尾增加 Infinity, 方便计算
  indexs.unshift(-Infinity);
  indexs.push(Infinity);

  // 3. 遍历 s
  for (let i = 0; i < s.length; i++) {
    ans.push(Math.min(i - indexs[0], indexs[1] - i));

    // 如果越界了, 那么在 indexs 上删除一个
    if (i >= indexs[1]) {
      indexs.shift();
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "loveleetcode"\n"e"\n
// @lcpr case=end

// @lcpr case=start
// "aaab"\n"b"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = shortestToChar;
// @lcpr-after-debug-end

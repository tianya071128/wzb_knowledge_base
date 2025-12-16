/*
 * @lc app=leetcode.cn id=1209 lang=javascript
 * @lcpr version=30204
 *
 * [1209] 删除字符串中的所有相邻重复项 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var removeDuplicates = function (s, k) {
  /**
   * 使用栈, 并且使用另一个栈存储连续字符的长度
   */
  let ans = [],
    stack = []; // 连续字符的长度

  for (const item of s) {
    ans.push(item);
    stack.push(ans.at(-1) === ans.at(-2) ? stack.at(-1) + 1 : 1);

    // 如果到达 k 长度, 出栈
    if (stack.at(-1) === k) {
      ans.splice(ans.length - k, k);
      stack.splice(stack.length - k, k);
    }
  }

  return ans.join('');
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=removeDuplicates
// paramTypes= ["string","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abcd"\n2\n
// @lcpr case=end

// @lcpr case=start
// "deeedbbcccbdaa"\n3\n
// @lcpr case=end

// @lcpr case=start
// "pbbcggttciiippooaaispbbcggttciiippooaaispbbcggttciiippooaaispbbcggttciiippooaaispbbcggttciiippooaais"\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeDuplicates;
// @lcpr-after-debug-end

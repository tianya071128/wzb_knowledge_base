/*
 * @lc app=leetcode.cn id=1541 lang=javascript
 * @lcpr version=30204
 *
 * [1541] 平衡括号字符串的最少插入次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var minInsertions = function (s) {
  // 将两个 ) 当成一个 ) 看待, 进行匹配
  let l = 0,
    ans = 0;

  for (let i = 0; i < s.length; i++) {
    let item = s[i];

    if (item === '(') {
      l++;
    } else {
      // 左括号为 0 个, 补一个
      if (l === 0) {
        ans++;
      } else {
        l--;
      }

      // 如果下个括号不是 ) 的话, 也要补一个
      if (s[i + 1] !== ')') {
        ans++;
      } else {
        // 跳过下个字符
        i++;
      }
    }
  }

  return ans + l * 2;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minInsertions
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "(()))"\n
// @lcpr case=end

// @lcpr case=start
// "())"\n
// @lcpr case=end

// @lcpr case=start
// "))())("\n
// @lcpr case=end

// @lcpr case=start
// "(((((("\n
// @lcpr case=end

// @lcpr case=start
// ")))))))"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minInsertions;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=1694 lang=javascript
 * @lcpr version=30204
 *
 * [1694] 重新格式化电话号码
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} number
 * @return {string}
 */
var reformatNumber = function (number) {
  /** @type {string} 结果 */
  let ans = '',
    /** @type {number} 当次字符数量 */
    cur = 0;

  for (const s of number) {
    if (s !== ' ' && s !== '-') {
      // 增加前缀
      if (ans.length && cur === 0) ans += '-';

      ans += s;
      cur = (cur + 1) % 3;
    }
  }

  // 处理最后的后缀
  if (ans[ans.length - 2] === '-') {
    return (
      ans.slice(0, ans.length - 5) +
      ans[ans.length - 5] +
      ans[ans.length - 4] +
      '-' +
      ans[ans.length - 3] +
      ans[ans.length - 1]
    );
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "1-23-45 6"\n
// @lcpr case=end

// @lcpr case=start
// "123 4-567"\n
// @lcpr case=end

// @lcpr case=start
// "123 4-5678"\n
// @lcpr case=end

// @lcpr case=start
// "12"\n
// @lcpr case=end

// @lcpr case=start
// "--17-5 229 35-39475 "\n
// @lcpr case=end

 */

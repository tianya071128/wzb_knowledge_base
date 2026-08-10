/*
 * @lc app=leetcode.cn id=1598 lang=javascript
 * @lcpr version=30204
 *
 * [1598] 文件夹操作日志搜集器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} logs
 * @return {number}
 */
var minOperations = function (logs) {
  let ans = 0;

  for (const log of logs) {
    if (log === '../') {
      ans = Math.max(0, ans - 1);
    } else if (log === './') {
      // 静默不处理
    } else {
      ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["d1/","d2/","../","d21/","./"]\n
// @lcpr case=end

// @lcpr case=start
// ["d1/","d2/","./","d3/","../","d31/"]\n
// @lcpr case=end

// @lcpr case=start
// ["d1/","../","../","../"]\n
// @lcpr case=end

 */

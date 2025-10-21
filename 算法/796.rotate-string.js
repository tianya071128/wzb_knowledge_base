/*
 * @lc app=leetcode.cn id=796 lang=javascript
 * @lcpr version=30204
 *
 * [796] 旋转字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function (s, goal) {
  if (s.length !== goal.length) return false;

  other: for (let start = 0; start < goal.length; start++) {
    if (goal[start] === s[0]) {
      // 从该点启动查找是否相同
      // 内部遍历 s, 从 start 点对比 goal
      for (let j = 1; j < s.length; j++) {
        if (s[j] !== goal[(start + j) % goal.length]) {
          // 继续下一个
          continue other;
        }
      }

      return true;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// "abcde"\n"cdeab"\n
// @lcpr case=end

// @lcpr case=start
// "abcde"\n"abced"\n
// @lcpr case=end

 */

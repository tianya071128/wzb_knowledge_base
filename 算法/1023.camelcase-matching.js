/*
 * @lc app=leetcode.cn id=1023 lang=javascript
 * @lcpr version=30204
 *
 * [1023] 驼峰式匹配
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} queries
 * @param {string} pattern
 * @return {boolean[]}
 */
var camelMatch = function (queries, pattern) {
  let ans = [];

  for (const s of queries) {
    /**
     * 双指针
     */
    let p1 = 0,
      p2 = 0;
    while (p1 < s.length) {
      if (s[p1] === pattern[p2]) {
        p2++;
      }
      // 如果是大写的, 直接退出循环
      else if (s[p1].charCodeAt() < 97) {
        break;
      }

      p1++;
    }

    ans.push(p1 === s.length && p2 === pattern.length);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"]\n"FB"\n
// @lcpr case=end

// @lcpr case=start
// ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"]\n"FoBa"\n
// @lcpr case=end

// @lcpr case=start
// ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"]\n"FoBaT"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = camelMatch;
// @lcpr-after-debug-end

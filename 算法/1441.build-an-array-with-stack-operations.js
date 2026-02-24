/*
 * @lc app=leetcode.cn id=1441 lang=javascript
 * @lcpr version=30204
 *
 * [1441] 用栈操作构建数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} target
 * @param {number} n
 * @return {string[]}
 */
var buildArray = function (target, n) {
  let ans = [],
    p1 = 0,
    p2 = 1;
  while (p1 < target.length) {
    let cur = target[p1]; // target 项

    // 补齐缺口
    while (cur !== p2) {
      ans.push('Push', 'Pop');
      p2++;
    }

    p1++;
    p2++;

    ans.push('Push');
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,3]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n4\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1306 lang=javascript
 * @lcpr version=30204
 *
 * [1306] 跳跃游戏 III
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
var canReach = function (arr, start) {
  /**
   * 图
   */
  let paths = new Set(); // 已经走过的路

  function dfs(start) {
    // 已经走过的话, 直接返回 false
    if (paths.has(start)) return false;
    if (arr[start] === 0) return true;

    paths.add(start);

    let next1 = start + arr[start],
      next2 = start - arr[start];

    if (next1 >= 0 && next1 < arr.length && dfs(next1)) return true;
    if (next2 >= 0 && next2 < arr.length && dfs(next2)) return true;

    return false;
  }

  return dfs(start);
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,3,0,3,1,2]\n5\n
// @lcpr case=end

// @lcpr case=start
// [4,2,3,0,3,1,2]\n0\n
// @lcpr case=end

// @lcpr case=start
// [3,0,2,1,2]\n2\n
// @lcpr case=end

 */

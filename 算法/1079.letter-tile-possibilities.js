/*
 * @lc app=leetcode.cn id=1079 lang=javascript
 * @lcpr version=30204
 *
 * [1079] 活字印刷
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} tiles
 * @return {number}
 */
var numTilePossibilities = function (tiles) {
  /**
   * 回溯
   */
  let ans = new Set(),
    paths = new Set(), // 回溯的路径
    pathStr = ''; // 回溯组成的字符串

  function dfs() {
    pathStr && ans.add(pathStr);
    if (paths.length === tiles.length) {
      return;
    }

    for (let i = 0; i < tiles.length; i++) {
      // 已经走过的略过
      if (paths.has(i)) continue;

      paths.add(i);
      pathStr += tiles[i];
      dfs();

      // 出栈
      paths.delete(i);
      pathStr = pathStr.slice(0, -1);
    }
  }

  dfs();

  return ans.size;
};
// @lc code=end

/*
// @lcpr case=start
// "ABCDEFG"\n
// @lcpr case=end

// @lcpr case=start
// "AAABBC"\n
// @lcpr case=end

// @lcpr case=start
// "V"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numTilePossibilities;
// @lcpr-after-debug-end

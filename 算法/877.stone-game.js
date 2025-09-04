/*
 * @lc app=leetcode.cn id=877 lang=javascript
 * @lcpr version=30204
 *
 * [877] 石子游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} piles
 * @return {boolean}
 */
var stoneGame = function (piles) {
  /**
   * 只要得出 Alice 能够拿到最大的石头数量即可
   * [5,3,4,5]
   */

  /**
   * 计算区间内的两方最大值
   * @param {*} left 左边界
   * @param {*} right 右边界
   * @returns
   */
  let cache = new Map();
  function dfs(left, right) {
    // 如果超出边界了, 那么就是返回 [0,0]
    if (left > right) return [0, 0];

    // 存在缓存, 直接取缓存
    let cacheId = `${left},${right}`;
    if (cache.has(cacheId)) return cache.get(cacheId);

    /**
     * 计算三种可能:
     *  - 分别取了两端的数字
     *  - 取了最左端的数字
     *  - 取了最右端的数字
     */
    let res = [
        [
          piles[left] + dfs(left + 1, right - 1)[0],
          piles[right] + dfs(left + 1, right - 1)[1],
        ],
        [
          piles[right] + dfs(left + 1, right - 1)[0],
          piles[left] + dfs(left + 1, right - 1)[1],
        ],
        [
          piles[left] + dfs(left + 2, right)[0],
          piles[left + 1] + dfs(left + 2, right)[1],
        ],
        [
          piles[right] + dfs(left, right - 2)[0],
          piles[right - 1] + dfs(left, right - 2)[1],
        ],
      ],
      ans = res[0];

    // 取最大值
    for (let i = 1; i < res.length; i++) {
      if (res[i][0] > ans[0]) {
        ans = res[i];
      }
    }

    cache.set(cacheId, ans);

    return ans;
  }

  let ans = dfs(0, piles.length - 1);

  return ans[0] > ans[1];
};
// @lc code=end

/*
// @lcpr case=start
// [5,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [10,3,1,7,8,6,8,10]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = stoneGame;
// @lcpr-after-debug-end

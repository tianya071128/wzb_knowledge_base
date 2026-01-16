/*
 * @lc app=leetcode.cn id=1311 lang=javascript
 * @lcpr version=30204
 *
 * [1311] 获取你好友已观看的视频
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} watchedVideos
 * @param {number[][]} friends
 * @param {number} id
 * @param {number} level
 * @return {string[]}
 */
var watchedVideosByFriends = function (watchedVideos, friends, id, level) {
  /** 记录下每个 id 从起始点到达的 level */
  let levels = Array(watchedVideos.length).fill(Infinity);

  function dfs(id, curLevel) {
    // 终止条件1
    if (levels[id] <= curLevel || curLevel > level) return;

    levels[id] = curLevel;

    for (const item of friends[id]) {
      dfs(item, curLevel + 1);
    }
  }

  dfs(id, 0);

  /** 记录下满足 level 的 id 所观看视频的个数 */
  let max = 0,
    hash = new Map();
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] === level) {
      for (const item of watchedVideos[i]) {
        let n = (hash.get(item) ?? 0) + 1;
        hash.set(item, n);

        max = Math.max(max, n);
      }
    }
  }

  /** 根据 max 创建一个排序数组, 用于排序 */
  let ans = [],
    sorts = Array.from({ length: max + 1 }, () => []);

  for (const [video, n] of hash) {
    sorts[n].push(video);
  }

  // 得出结果
  for (const item of sorts) {
    ans.push(...item.sort());
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=watchedVideosByFriends
// paramTypes= ["string[][]","number[][]","number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [["A","B"],["C"],["B","C"],["D"]]\n[[1,2],[0,3],[0,3],[1,2]]\n0\n1\n
// @lcpr case=end

// @lcpr case=start
// [["A","B"],["C"],["B","C"],["D"]]\n[[1,2],[0,3,2],[0,3,1],[1,2]]\n0\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = watchedVideosByFriends;
// @lcpr-after-debug-end

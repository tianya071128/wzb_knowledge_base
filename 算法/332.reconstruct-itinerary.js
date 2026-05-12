/*
 * @lc app=leetcode.cn id=332 lang=javascript
 * @lcpr version=30204
 *
 * [332] 重新安排行程
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} tickets
 * @return {string[]}
 */
var findItinerary = function (tickets) {
  /**
   * 深度优先搜索
   */

  /** 1. 根据 tickets 建立 hash 节点 */
  /** @type { Map<string, string[]> } */
  let nodes = new Map();
  for (const [start, end] of tickets) {
    if (!nodes.has(start)) nodes.set(start, []);

    nodes.get(start).push(end);
  }

  /** 2. 对邻接表进行排序, 字母序在签名的先飞 */
  for (const [start, ends] of nodes) {
    ends.sort();
  }

  /** 2. 深度搜素 */
  let paths = ['JFK'],
    processed = new Set(),
    ans;
  function dfs(start) {
    // 已全部走过
    if (processed.size === tickets.length) {
      ans = [...paths];
      return true;
    }

    for (const end of nodes.get(start) ?? []) {
      let key = `${start} -> ${end}`;
      if (!processed.has(key)) {
        processed.add(key);
        paths.push(end);
        if (dfs(end)) {
          // 已找到一条路径
          return true;
        }

        // 回退
        processed.delete(key);
        paths.pop();
      }
    }

    return false;
  }
  dfs(paths[0]);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [["JFK","SFO"],["JFK","ATL"],["SFO","JFK"],["ATL","AAA"],["AAA","ATL"],["ATL","BBB"],["BBB","ATL"],["ATL","CCC"],["CCC","ATL"],["ATL","DDD"],["DDD","ATL"],["ATL","EEE"],["EEE","ATL"],["ATL","FFF"],["FFF","ATL"],["ATL","GGG"],["GGG","ATL"],["ATL","HHH"],["HHH","ATL"],["ATL","III"],["III","ATL"],["ATL","JJJ"],["JJJ","ATL"],["ATL","KKK"],["KKK","ATL"],["ATL","LLL"],["LLL","ATL"],["ATL","MMM"],["MMM","ATL"],["ATL","NNN"],["NNN","ATL"]]\n
// @lcpr case=end

// @lcpr case=start
// [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findItinerary;
// @lcpr-after-debug-end

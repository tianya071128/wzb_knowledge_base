/*
 * @lc app=leetcode.cn id=949 lang=javascript
 * @lcpr version=30204
 *
 * [949] 给定数字能组成的最大时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {string}
 */
var largestTimeFromDigits = function (arr) {
  /**
   * 穷举所有可能
   */
  let max = -1,
    paths = [], // 回溯的路径
    // 注意: 第二项的合法值, 会根据第一项的合法值变化
    legals = [2, 3, 5, 9]; // 合法值

  function dfs(level) {
    // 终点
    if (level === 4) {
      let curRes = paths.reduce((total, item) => total * 10 + arr[item], 0);

      max = Math.max(max, curRes);
      return;
    }

    let legal = legals[level];

    // 处理第二项的合法值
    if (level === 1 && arr[paths[0]] !== 2) {
      legal = 9;
    }

    for (let i = 0; i < arr.length; i++) {
      // 如果当前值已经使用, 或者不合法
      if (paths.includes(i) || arr[i] > legal) continue;

      paths.push(i);
      dfs(level + 1);
      paths.pop();
    }
  }
  dfs(0);

  if (max === -1) return '';

  /** @type string 转为字符串 */
  let ans = String(max);
  // 补0
  ans = `${'0'.repeat(4 - ans.length)}${ans}`;

  return ans.slice(0, 2) + ':' + ans.slice(2);
};
// @lc code=end

/*
// @lcpr case=start
// [0,4,0,0]\n
// @lcpr case=end

// @lcpr case=start
// [2,0,6,6]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = largestTimeFromDigits;
// @lcpr-after-debug-end

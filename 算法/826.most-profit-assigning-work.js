/*
 * @lc app=leetcode.cn id=826 lang=javascript
 * @lcpr version=30204
 *
 * [826] 安排工作以达到最大收益
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} difficulty
 * @param {number[]} profit
 * @param {number[]} worker
 * @return {number}
 */
var maxProfitAssignment = function (difficulty, profit, worker) {
  /**
   * 贪心: 尽可能将每个工作的收益最高
   *
   * 1. 使用 hash 存储每个收益对应工作的难度 --> 相同收益取最小难度
   * 2. 对收益进行排序 -> 从收益高开始遍历
   * 3. 对工人进行升序排序
   * 4. 从高收益开始在工人中查找 --> 二分搜索
   */
  let ans = 0,
    hash = new Map();

  // 使用 hash 存储每个收益对应工作的难度
  for (let i = 0; i < profit.length; i++) {
    hash.set(
      profit[i],
      Math.min(hash.get(profit[i]) ?? Infinity, difficulty[i])
    );
  }

  profit.sort((a, b) => b - a);
  worker.sort((a, b) => a - b);

  // 二分搜索在工人中查找对应收益
  let rightMax = worker.length - 1; // 最右侧边界
  for (let i = 0; i < profit.length; i++) {
    // 重复收益无需重复检测
    if (profit[i] === profit[i - 1]) continue;

    // 难度
    const difficultyItem = hash.get(profit[i]);

    // 已经无人可以担任该工作
    if (worker[rightMax] < difficultyItem) continue;

    // 启动二分搜索
    let left = 0,
      right = rightMax;
    while (left < right) {
      let mid = left + Math.floor((right - left) / 2);
      if (worker[mid] < difficultyItem) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    ans += profit[i] * (rightMax - left + 1);
    rightMax = left - 1;

    // 如果工人已经分配完毕, 提前退出
    if (rightMax < 0) break;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,4,6,8,10]\n[10,20,30,40,40]\n[4,5,6,7]\n
// @lcpr case=end

// @lcpr case=start
// [85,47,57]\n[24,66,99]\n[40,25,25]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxProfitAssignment;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=134 lang=typescript
 * @lcpr version=30204
 *
 * [134] 加油站
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function canCompleteCircuit(gas: number[], cost: number[]): number {
  /**
   * 解题思路:
   *  1. 计算每个路程之间的加油量和耗油量的插值
   *  2. 通过从后往前遍历净剩余汽油量数组，记录满足一定条件的加油站索引作为可能的出发加油站。
   *  3. 当最后净油量大于 0 时, 返回记录的出发加油点
   */
  const netGasDifferences = gas.map((item, i) => item - cost[i]); // 计算每个加油站的净剩余汽油量
  let totalNetGas = 0, // 用于记录所有加油站的净剩余汽油量的总和
    possibleStartingStation = -1, // 用于记录可能的出发加油站的索引
    maxGas = -1;

  for (let i = netGasDifferences.length - 1; i >= 0; i--) {
    totalNetGas += netGasDifferences[i];

    // 寻找出发加油站
    // 1. 表示从当前加油站开始到最后一个加油站的净剩余汽油量总和大于等于 0，说明有可能从这里出发绕一圈。
    // 2. 表示当前加油站的净剩余汽油量大于等于 0，即该加油站的汽油量足够到达下一个加油站。
    // 3. 表示当前加油站有汽油，这是能够出发的基本条件。
    if (totalNetGas >= 0 && gas[i] > 0 && totalNetGas > maxGas) {
      possibleStartingStation = i;
      maxGas = totalNetGas;
    }
  }

  return totalNetGas < 0 ? -1 : possibleStartingStation ?? 0;
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n[3,4,5,1,2]\n
// @lcpr case=end

/*
// @lcpr case=start
// [5,1,2,3,4]\n[4,4,1,5,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,3,4]\n[3,4,3]\n
// @lcpr case=end

 */

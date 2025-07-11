/*
 * @lc app=leetcode.cn id=698 lang=javascript
 * @lcpr version=30204
 *
 * [698] 划分为k个相等的子集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var canPartitionKSubsets = function (nums, k) {
  /**
   * 1. 计算每个子集应该存在的数字  --> 计算 sum(nums) 数
   * 2. 回溯找到组合
   */
  nums.sort((a, b) => a - b);
  const total = nums.reduce((total, item) => total + item);
  const num = total / k; // 每个子集的总和

  // 如果不是整数, 肯定不满足
  if (total % k !== 0) return false;

  const used = new Array(nums.length).fill(false); // 已经参与的组合
  /**
   *
   * @param {number} target 找到组合的数
   * @param {number} k 需要找到的次数
   * @param {number} start 开始查找的位置
   */
  function dfs(target, k, start) {
    // 已经找到当前组合, 继续查找下一次的
    if (target === 0) return dfs(num, k - 1, 0);

    // 已经找到对应次数
    if (k === 0) return true;

    // 开始查找
    for (let i = start; i < nums.length; i++) {
      if (used[i]) continue; // 该项已被组合过, 不做处理

      const item = nums[i];

      if (item > target) break; // 剩下的元素都大于剩余空间, 那么直接退出当前迭代

      used[i] = true;

      const res = dfs(target - item, k, i + 1);

      // 如果返回了 true, 说明已经找到了组合, 直接返回 ture 出去
      if (res) return res;

      used[i] = false;
    }

    return false;
  }

  // 初始找 k - 1 个, 剩下的肯定符合条件
  return dfs(num, k - 1, 0);
};
// @lc code=end

/*
// @lcpr case=start
// [4, 3, 2, 3, 5, 2, 1]\n4\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n3\n
// @lcpr case=end

 */

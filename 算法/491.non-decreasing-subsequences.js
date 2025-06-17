/*
 * @lc app=leetcode.cn id=491 lang=javascript
 * @lcpr version=30204
 *
 * [491] 非递减子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function (nums) {
  // 回溯
  if (nums.length < 2) return [];

  let paths = [],
    ans = [],
    key = '', // 记录下路径的唯一值
    set = new Set(); // 用于去除
  function dfs(start) {
    if (paths.length >= 2 && !set.has(key)) {
      ans.push([...paths]);
      set.add(key);
    }

    for (let i = start; i < nums.length; i++) {
      // 是否可以选择该项
      if (nums[i] >= (paths.at(-1) ?? -Infinity)) {
        const keyPrefix = String(nums[i]) + ',';
        key += keyPrefix;
        paths.push(nums[i]);
        dfs(i + 1);
        paths.pop(); // 退出该项选择, 继续选择下一项
        key = key.slice(0, -1 * keyPrefix.length);
      }
    }
  }
  dfs(0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n
// @lcpr case=end

// @lcpr case=start
// [4, 6, 7, 7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findSubsequences;
// @lcpr-after-debug-end

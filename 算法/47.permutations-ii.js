/*
 * @lc app=leetcode.cn id=47 lang=javascript
 * @lcpr version=30204
 *
 * [47] 全排列 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  // 同 46 题, 区别在于存在重复项

  const res = [],
    used = {}; // 使用 hash 判断索引重复
  nums = nums.sort((a, b) => a - b);

  function dfs(path) {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }

    let prev;
    for (let i = 0; i < nums.length; i++) {
      // 剪枝: 当重复索引或者与前一个值(不包含重复索引项)相同时
      if (used[i] || nums[i] === prev) continue;

      const item = nums[i];
      path.push(item);
      used[i] = true;
      dfs(path);
      path.pop();
      used[i] = false;
      prev = item;
    }
  }

  dfs([], []);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

 */

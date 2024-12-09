/*
 * @lc app=leetcode.cn id=46 lang=javascript
 * @lcpr version=30204
 *
 * [46] 全排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  /**
   * 回溯算法
   */
  const res = [];
  function dfs(temp, indexs) {
    if (temp.length === nums.length) {
      res.push(temp);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      const item = nums[i];
      // 剪枝: 当存在于 temp 时, 无需重复添加
      if (!indexs.includes(i)) {
        dfs([...temp, item], [...indexs, i]);
      }
    }
  }

  dfs([], []);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [0,1]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

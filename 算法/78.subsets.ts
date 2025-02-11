/*
 * @lc app=leetcode.cn id=78 lang=typescript
 * @lcpr version=30204
 *
 * [78] 子集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function subsets(nums: number[]): number[][] {
  // 回溯
  const ans: number[][] = [],
    path: number[] = [];

  function dfs(i: number) {
    // 结果直接追加进去
    ans.push([...path]);

    // 无需剪枝

    for (let index = i; index < nums.length; index++) {
      const item = nums[index];
      path.push(item);
      dfs(index + 1);
      path.pop();
    }
  }

  dfs(0);

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=90 lang=typescript
 * @lcpr version=30204
 *
 * [90] 子集 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function subsetsWithDup(nums: number[]): number[][] {
  // 与 78.子集类似, 但是存在重复元素, 所有在每轮选择中跳过重复元素
  nums = nums.sort((a, b) => a - b);

  let ans: number[][] = [],
    path: number[] = [];

  function dfs(i: number) {
    // 追加结果
    ans.push([...path]);

    // 无需剪枝

    const map = {};
    for (let index = i; index < nums.length; index++) {
      const item = nums[index];
      // 在每轮选择中跳过重复元素
      if (map[item]) continue;
      map[item] = true; // 标记访问过
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
// [1,2,2]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */

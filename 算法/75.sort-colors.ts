/*
 * @lc app=leetcode.cn id=75 lang=typescript
 * @lcpr version=30204
 *
 * [75] 颜色分类
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function sortColors(nums: number[]): void {
  // 计数排序
  const list = [0, 0, 0];
  for (const item of nums) {
    list[item]++;
  }

  // 原地处理
  let cur = 0;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i]; j++) {
      nums[cur++] = i;
    }
  }
}
// @lc code=end

/*
// @lcpr case=start
// [2,0,2,1,1,0]\n
// @lcpr case=end

// @lcpr case=start
// [2,0,1]\n
// @lcpr case=end

 */

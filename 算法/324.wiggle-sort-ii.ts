/*
 * @lc app=leetcode.cn id=324 lang=typescript
 * @lcpr version=30204
 *
 * [324] 摆动排序 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function wiggleSort(nums: number[]): void {
  // 观察规律可得
  // 1. 排序
  // 2. 找到中点, 从中点往左、终点往左到中点分为两个数组，此时两个数组交叉取一个组成一个数组
  nums = nums.sort((a, b) => a - b);

  // 左侧数组需要占据更多元素
  let mid = Math.ceil(nums.length / 2),
    left = nums.slice(0, mid),
    right = nums.slice(mid, nums.length),
    k = 0;

  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const n1 = left[left.length - 1 - index],
      n2 = right[right.length - 1 - index];

    if (n1 != undefined) {
      nums[k++] = n1;
    }

    if (n2 != undefined) {
      nums[k++] = n2;
    }
  }
}
// @lc code=end

/*
// @lcpr case=start
// [1,5,1,1,6,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,2,2,3,1]\n
// @lcpr case=end

 */

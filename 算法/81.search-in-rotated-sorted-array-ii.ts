/*
 * @lc app=leetcode.cn id=81 lang=typescript
 * @lcpr version=30204
 *
 * [81] 搜索旋转排序数组 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function search(nums: number[], target: number): boolean {
  // 二分查找, 但是注意的判定条件有一定变化
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left;
    const n1 = nums[left],
      n2 = nums[mid],
      n3 = nums[right];

    if (n2 === target) {
      return true;
    } else if (n2 < target) {
      if (n2 < n3 && target > n3) {
        // 移动右指针
        right = mid - 1;
      } else {
        // 移动左指针
        left = mid + 1;
      }
    } else {
      if (n2 > n1 && target < n1) {
        // 移动左指针
        left = mid + 1;
      } else {
        // 移动右指针
        right = mid - 1;
      }
    }
  }

  return false;
}
search([1, 0, 1, 1, 1], 0);
// @lc code=end

/*
// @lcpr case=start
// [2,5,6,0,0,1,2]\n0\n
// @lcpr case=end

// @lcpr case=start
// [2,5,6,0,0,1,2]\n3\n
// @lcpr case=end

 */

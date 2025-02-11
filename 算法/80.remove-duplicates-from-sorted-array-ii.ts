/*
 * @lc app=leetcode.cn id=80 lang=typescript
 * @lcpr version=30204
 *
 * [80] 删除有序数组中的重复项 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function removeDuplicates(nums: number[]): number {
  let n = 0, // 重复个数
    currentItem = nums[0], // 当前项
    currentNum = 1; // 当前项次数

  for (let index = 1; index < nums.length; index++) {
    const item = nums[index];

    if (item === currentItem) {
      // 超出项, 剔除
      if (currentNum >= 2) {
        n++;
        continue;
      }
      currentNum++;
    } else {
      // 重置相关参数
      currentItem = item;
      currentNum = 1;
    }

    // 根据重复个数, 调整位置
    nums[index - n] = item;
  }

  return nums.length - n;
}
// @lc code=end

/*
// @lcpr case=start
// [1,1,1,2,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,1,1,1,2,3,3]\n
// @lcpr case=end

 */

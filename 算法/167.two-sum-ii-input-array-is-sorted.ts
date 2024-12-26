/*
 * @lc app=leetcode.cn id=167 lang=typescript
 * @lcpr version=30204
 *
 * [167] 两数之和 II - 输入有序数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function twoSum(numbers: number[], target: number): number[] {
  // 似乎双指针就可以了
  let left = 0,
    right = numbers.length - 1;

  while (left < right) {
    const n = numbers[left] + numbers[right];
    if (n === target) {
      return [left + 1, right + 1];
    } else if (n > target) {
      right--;
    } else {
      left++;
    }
  }

  // 无效代码, 通过类型检测
  return [left, right];
}
// @lc code=end

/*
// @lcpr case=start
// [2,7,11,15]\n9\n
// @lcpr case=end

// @lcpr case=start
// [2,3,4]\n6\n
// @lcpr case=end

// @lcpr case=start
// [-1,0]\n-1\n
// @lcpr case=end

 */

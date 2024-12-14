/*
 * @lc app=leetcode.cn id=18 lang=javascript
 * @lcpr version=30204
 *
 * [18] 四数之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  /**
   * 三数之和的升级版, 增加一个指针
   */
  // 先进行排序
  nums = nums.sort((a, b) => a - b);
  let left = (right = 0),
    res = [],
    n1,
    n2,
    n3,
    n4,
    len = nums.length;

  for (let i = 0; i < len - 3; i++) {
    n1 = nums[i];

    // 防重复
    if (n1 === nums[i - 1]) continue;

    // 优化一: 当后续的四个数之和大于 target, 也就没有必要比较
    if (n1 + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
    // 优化二: 当该数与最后几个数之和都小于 target, 那么就直接进行下一次循环
    if (n1 + nums[len - 3] + nums[len - 2] + nums[len - 1] < target) continue;

    for (let j = i + 1; j < len - 2; j++) {
      n2 = nums[j];

      // 防重复
      if (n2 === nums[j - 1] && j !== i + 1) continue;
      // 优化一: 当后续的四个数之和大于 target, 也就没有必要比较
      if (n1 + n2 + nums[j + 1] + nums[j + 2] > target) break;
      // 优化二: 当该数与最后几个数之和都小于 target, 那么就直接进行下一次循环
      if (n1 + n2 + nums[len - 2] + nums[len - 1] < target) continue;

      // 接下来就缩小为两数之和等于 target - n1 - n2
      left = j + 1;
      right = len - 1;
      while (left < right) {
        n3 = nums[left];
        n4 = nums[right];

        const diff = target - n1 - n2 - n3 - n4;
        if (diff === 0) {
          res.push([n1, n2, n3, n4]);
          // 同时移动左右指针
          do {
            left++;
          } while (nums[left] === nums[left - 1]);
          do {
            right--;
          } while (nums[right] === nums[right + 1]);
        }
        // 大于 0, 移动左指针
        else if (diff > 0) {
          left++;
        }
        // 小于 0, 移动右指针
        else {
          right--;
        }
      }
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,-1,0,-2,2]\n0\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,2,2]\n8\n
// @lcpr case=end

 */

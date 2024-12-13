/*
 * @lc app=leetcode.cn id=16 lang=javascript
 * @lcpr version=30204
 *
 * [16] 最接近的三数之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  /**
   * 思路: 15 题的变种
   */
  // 先进行排序
  nums.sort((a, b) => a - b);

  let left,
    right,
    res = Infinity,
    sum,
    n1,
    n2,
    n3,
    diff;

  // 外层循环固定一个数
  for (let i = 0; i < nums.length - 1; i++) {
    n1 = nums[i];

    // 使用双指针
    left = i + 1;
    right = nums.length - 1;
    while (left < right) {
      n2 = nums[left];
      n3 = nums[right];
      diff = n1 + n2 + n3 - target;

      // 更接近
      if (Math.abs(res) > Math.abs(diff)) res = diff;

      // 直接退出
      if (diff === 0) {
        return target;
      }
      // 此时, 移动右指针
      else if (diff > 0) {
        right--;
      }
      // 移动左指针
      else {
        left++;
      }
    }
  }

  return res + target;
};
// @lc code=end

/*
// @lcpr case=start
// [-1,2,1,-4]\n1\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0]\n1\n
// @lcpr case=end

 */

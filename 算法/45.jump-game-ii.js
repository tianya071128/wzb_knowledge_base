/*
 * @lc app=leetcode.cn id=45 lang=javascript
 * @lcpr version=30204
 *
 * [45] 跳跃游戏 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  if (nums.length < 2) return 0;

  /**
   * 思路: 使用一个指针表示当前位置, 在这个指针中可跳转的范围中查找到可跳转至最远的项, 跳转至该项
   */
  let current = 0,
    num = 0;
  while (current < nums.length) {
    let range = current + nums[current],
      max = 0,
      i;

    // 此时已经可以跳转至终点
    if (range >= nums.length - 1) return num + 1;

    // 迭代该范围, 找到可跳转至最远的项
    for (let index = current + 1; index <= range; index++) {
      // 跳过为 0  的
      if (nums[index] + index > max && nums[index] !== 0) {
        max = nums[index] + index;
        i = index;
      }
    }

    // 移动指针
    current = i;
    num++;
  }

  return num;
};
// @lc code=end

/*
// @lcpr case=start
// [2,3,1,1,4]\n
// @lcpr case=end

// @lcpr case=start
// [2,3,0,1,4]\n
// @lcpr case=end

 */

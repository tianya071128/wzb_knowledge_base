/*
 * @lc app=leetcode.cn id=1052 lang=javascript
 * @lcpr version=30204
 *
 * [1052] 爱生气的书店老板
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} customers
 * @param {number[]} grumpy
 * @param {number} minutes
 * @return {number}
 */
var maxSatisfied = function (customers, grumpy, minutes) {
  /**
   * 1. 首先计算不使用秘密技巧时, 总共会有多少用户满意
   * 2. 之后使用 滑动窗口(窗口大小为 minutes), 计算下窗口中能够新增的满意用户
   */
  let ans = 0;
  for (let i = 0; i < customers.length; i++) {
    ans += grumpy[i] === 0 ? customers[i] : 0;
  }

  // 滑动窗口计算增量
  let diff = 0, // 最大增量
    res = 0, // 窗口的增量值
    left = 0,
    right = minutes - 1;
  // 先计算窗口的大小
  for (let j = left; j <= right; j++) {
    res += grumpy[j] === 1 ? customers[j] : 0;
  }
  diff = res;
  left++;
  right++;
  while (right < grumpy.length) {
    // 计算窗口移动后, 窗口的大小
    res =
      res +
      (grumpy[right] === 1 ? customers[right] : 0) -
      (grumpy[left - 1] === 1 ? customers[left - 1] : 0);
    diff = Math.max(diff, res);

    left++;
    right++;
  }

  return diff + ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,1,2,1,1,7,5]\n[0,1,0,1,0,1,0,1]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n[0]\n1\n
// @lcpr case=end

 */

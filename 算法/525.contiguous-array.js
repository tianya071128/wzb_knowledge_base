/*
 * @lc app=leetcode.cn id=525 lang=javascript
 * @lcpr version=30204
 *
 * [525] 连续数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxLength = function (nums) {
  /**
   * 迭代中, 找到连续 0 或 1 的数量,
   * 并且记录下上一个区域的数量, 就可以得出最长连续子数组
   */
  let prevNum = 0,
    ans = 0,
    curNum = 0;
  for (let i = 0; i < nums.length; i++) {
    curNum++;

    // 当与下一个元素不同时, 处理
    if (nums[i] !== nums[i + 1]) {
      ans = Math.max(Math.min(prevNum, curNum) * 2, ans);

      prevNum = curNum;
      curNum = 0;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,1,1,1,1,0,0,0]\n
// @lcpr case=end

 */

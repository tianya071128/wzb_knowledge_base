/*
 * @lc app=leetcode.cn id=904 lang=javascript
 * @lcpr version=30204
 *
 * [904] 水果成篮
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} fruits
 * @return {number}
 */
var totalFruit = function (fruits) {
  /**
   * 滑动窗口:
   *
   *  --> 也就是在窗口中, 最多两种不同的数字
   *  --> 同时使用 哈希(map) 记录一下窗口的数字以及数字最后出现的索引(方便在往左移动窗口的时候快速定位)
   */
  let ans = 0,
    hash = new Map(),
    left = 0,
    right = 0;
  while (right < fruits.length) {
    // 移动左指针 - 缩小窗口
    if (hash.size === 2 && !hash.has(fruits[right])) {
      // 找到当前窗口索引最小的值
      let nums = [...hash.entries()],
        n = nums[0][1] < nums[1][1] ? nums[0] : nums[1];

      // 清除移出去的数字
      hash.delete(n[0]);
      left = n[1] + 1;
    }

    ans = Math.max(ans, right - left + 1);

    hash.set(fruits[right], right); // 记录出现的索引
    right++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,2,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,3,3,1,2,1,1,2,3,3,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = totalFruit;
// @lcpr-after-debug-end

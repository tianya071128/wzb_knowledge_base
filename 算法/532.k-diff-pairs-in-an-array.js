/*
 * @lc app=leetcode.cn id=532 lang=javascript
 * @lcpr version=30204
 *
 * [532] 数组中的 k-diff 数对
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findPairs = function (nums, k) {
  /**
   * 1. 排序
   * 2. 滑动窗口
   * 3. 哈希表, 记录下 diff对 的左值, 用于去重
   */
  nums = nums.sort((a, b) => a - b);
  let ans = 0,
    map = new Set(),
    p1 = 0,
    p2 = 1;
  while (p2 < nums.length) {
    // 相同时, 右指针右移
    if (p1 === p2) {
      p2++;
    }
    // 已经处理过的
    else if (map.has(nums[p1])) {
      p1++;
    }
    // 符合条件
    else if (nums[p2] - nums[p1] === k) {
      map.add(nums[p1]);
      ans++;
      p1++;
      p2++;
    }
    // 如果窗口差值大了的话, 左指针右移
    else if (nums[p2] - nums[p1] > k) {
      p1++;
    }
    // 如果窗口差值小了的话, 右指针右移
    else {
      p2++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3, 1, 4, 1, 5]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1, 2, 3, 4, 5]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1, 3, 1, 5, 4]\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findPairs;
// @lcpr-after-debug-end

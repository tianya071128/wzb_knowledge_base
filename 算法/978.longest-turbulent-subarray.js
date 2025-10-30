/*
 * @lc app=leetcode.cn id=978 lang=javascript
 * @lcpr version=30204
 *
 * [978] 最长湍流子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var maxTurbulenceSize = function (arr) {
  // if (arr.length <= 2) return arr.length;

  let ans = 1,
    l = 0,
    r = 0;

  while (l < arr.length - 1) {
    // 从 l 开始跳过重复值
    while (arr[l + 1] === arr[l]) {
      l++;
    }
    r = l;

    let next; // 下一个符号: 1 大于 | -1 小于
    while (
      r + 1 < arr.length &&
      (!next ||
        (next === 1 && arr[r + 1] > arr[r]) ||
        (next === -1 && arr[r + 1] < arr[r]))
    ) {
      next = arr[r + 1] > arr[r] ? -1 : 1;
      r++;
    }

    ans = Math.max(ans, r - l + 1);
    l = r;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,8,4,2,5,4,1,2,44,5,6,1,5,4,85,4,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [4,8,12,16]\n
// @lcpr case=end

// @lcpr case=start
// [9,9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxTurbulenceSize;
// @lcpr-after-debug-end

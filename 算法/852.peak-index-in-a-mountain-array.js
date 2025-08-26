/*
 * @lc app=leetcode.cn id=852 lang=javascript
 * @lcpr version=30204
 *
 * [852] 山脉数组的峰顶索引
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var peakIndexInMountainArray = function (arr) {
  /**
   * 二分搜索
   */
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);

    if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
      return mid;
    } else if (mid === 0 || arr[mid] > arr[mid - 1]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [18,29,38,59,98,100,99,98,90]\n
// @lcpr case=end

// @lcpr case=start
// [3,5,3,2,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,10,5,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = peakIndexInMountainArray;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=941 lang=javascript
 * @lcpr version=30204
 *
 * [941] 有效的山脉数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var validMountainArray = function (arr) {
  // 找到一个项, 比左右节点都大
  if (arr.length < 3 || arr[0] >= arr[1]) return false;

  let direction = 1; // 1 上行 | 1 下行
  for (let i = 1; i < arr.length - 1; i++) {
    // 转变方向
    if (direction === 1 && arr[i] > arr[i + 1]) {
      direction = -1;
    }
    // 方向不一致
    else if (
      (direction === 1 && arr[i] >= arr[i + 1]) ||
      (direction === -1 && arr[i] <= arr[i + 1])
    ) {
      return false;
    }
  }

  return direction === -1;
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,7,5,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,3,4,5,6,7,8,9]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,1,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = validMountainArray;
// @lcpr-after-debug-end

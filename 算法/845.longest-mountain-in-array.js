/*
 * @lc app=leetcode.cn id=845 lang=javascript
 * @lcpr version=30204
 *
 * [845] 数组中的最长山脉
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var longestMountain = function (arr) {
  let ans = 0,
    start = false,
    curCount = 1, // 当次总长度
    direction = 1; // 方向 1 上行 | -1 下行

  for (let i = 1; i < arr.length; i++) {
    let curDirection = arr[i] > arr[i - 1] ? 1 : arr[i] === arr[i - 1] ? 0 : -1;

    // 方向一致
    if (curDirection === direction) {
      curCount++;
      start = true;
    }
    // 方向不一致, 该次上行或平行
    else if (curDirection === 1 || curDirection === 0) {
      // 计算之前的是否合法
      if (curCount >= 3 && direction === -1) {
        ans = Math.max(ans, curCount);
      }

      // 平行
      if (curDirection === 0) {
        start = false;
        curCount = 1;
        direction = 1;
      } else {
        start = true;
        curCount = 2;
        direction = 1;
      }
    }
    // 方向不一致, 该次下行
    else {
      // 允许改变方向
      if (curCount >= 2) {
        curCount++;
        direction = -1;
      } else {
        curCount = 1;
        direction = 1;
        start = false;
      }
    }
  }

  return curCount >= 3 && direction === -1 && curCount > ans ? curCount : ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,2,3,4,5,6,7,8,9]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2]\n
// @lcpr case=end

 */

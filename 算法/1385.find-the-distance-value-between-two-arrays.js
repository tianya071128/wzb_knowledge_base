/*
 * @lc app=leetcode.cn id=1385 lang=javascript
 * @lcpr version=30204
 *
 * [1385] 两个数组间的距离值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number} d
 * @return {number}
 */
var findTheDistanceValue = function (arr1, arr2, d) {
  /**
   * 1. 排序 arr2
   * 2. 二分搜索 arr2 中最接近的项
   */
  let ans = 0;
  arr1.sort((a, b) => a - b);

  for (const n of arr1) {
    let l = 0,
      r = arr2.length - 1;
    while (l < r) {
      let mid = l + Math.floor((r - l) / 2);

      //
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [4,5,8]\n[10,9,1,8]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,4,2,3]\n[-4,-3,6,10,20,30]\n3\n
// @lcpr case=end

// @lcpr case=start
// [2,1,100,3]\n[-5,-2,10,-3,7]\n6\n
// @lcpr case=end

 */

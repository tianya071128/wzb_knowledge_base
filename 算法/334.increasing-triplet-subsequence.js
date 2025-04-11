/*
 * @lc app=leetcode.cn id=334 lang=javascript
 * @lcpr version=30204
 *
 * [334] 递增的三元子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    // 第一个数 - 固定的
    const n1 = nums[i];

    // 第二个数
    let n2;

    for (let j = i + 1; j < nums.length; j++) {
      const item = nums[j];
      // 如果还没有填充第二个数，此时填充
      if (n2 == null) {
        if (item > n1) {
          n2 = item;
        }
      }
      // 如果填充了第二个数
      else {
        // 组成结果, 直接 return 结果
        if (item > n2) {
          return true;
        }

        // 否则如果当前值比 n1 大但是比 n2 小, 直接替换掉
        if (item > n1 && item < n2) {
          n2 = item;
        }
      }
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [5,4,3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,5,0,4,6]\n
// @lcpr case=end

 */

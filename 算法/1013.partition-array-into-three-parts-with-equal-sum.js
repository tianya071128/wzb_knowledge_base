/*
 * @lc app=leetcode.cn id=1013 lang=javascript
 * @lcpr version=30204
 *
 * [1013] 将数组分成和相等的三个部分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var canThreePartsEqualSum = function (arr) {
  /**
   * 先计算出总和, 分成三份
   */
  let total = 0;
  for (const n of arr) {
    total += n;
  }

  if (total % 3 !== 0) return false;

  let sum = total / 3; // 区间总和

  // 从左开始计算区间到 sum, 并且存在三次这样的区间
  let n = 0, // 次数
    num = 0; // 区间值
  for (const item of arr) {
    num += item;

    if (num === sum) {
      n++;
      num = 0; // 区间值重置为 0

      // 达到三次, 直接返回
      if (n === 3) return true;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [0,2,1,-6,6,-7,9,1,2,0,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,2,1,-6,6,7,9,-1,2,0,1]\n
// @lcpr case=end

// @lcpr case=start
// [3,3,6,5,-2,2,5,1,-9,4]\n
// @lcpr case=end

 */

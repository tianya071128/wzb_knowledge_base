/*
 * @lc app=leetcode.cn id=1497 lang=javascript
 * @lcpr version=30204
 *
 * [1497] 检查数组对是否可以被 k 整除
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {boolean}
 */
var canArrange = function (arr, k) {
  /**
   * 贪心
   *  - 对每项元素都对 k 进行取模, 得出的元素, 如果是负数, 那么
   *  - 每项都有其固定的配对, 如果都配对成功的话, 那么就满足条件  --> 如果是负数, 那么就抵消正数的个数
   */
  if (k === 1) return true;

  let mod = Array(k).fill(0);

  for (const item of arr) {
    let n = item % k;

    if (n < 0) {
      mod[Math.abs(n)]--;
    } else {
      mod[n]++;
    }
  }

  // 检查是否都配对成功
  for (let i = 0; i < mod.length; i++) {
    // 0 特殊处理
    if (i === 0) {
      if (mod[i] % 2 === 1) return false;
    } else {
      if (mod[i] !== mod[k - i]) return false;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,10,6,7,8,9]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6]\n7\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6]\n10\n
// @lcpr case=end

 */

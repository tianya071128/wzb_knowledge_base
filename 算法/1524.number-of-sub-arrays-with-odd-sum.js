/*
 * @lc app=leetcode.cn id=1524 lang=javascript
 * @lcpr version=30204
 *
 * [1524] 和为奇数的子数组数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var numOfSubarrays = function (arr) {
  /**
   * 动态规划:
   *
   *   两个偶数相加为偶数
   *   两个奇数相加为偶数
   *   奇数和偶数相加为奇数
   *   最终只要子数组中的奇数个数为奇数, 那么最终结果就是奇数
   *
   * 以当前元素为结尾的子数组的奇数和个数:
   *  Odd(i) =
   *   - 当前数为奇数: Even(i - 1) + 1
   *   - 当前数为偶数: Odd(i - 1)
   *
   * 以当前元素为结尾的子数组的偶数和个数:
   *  Even(i) =
   *   - 当前数为奇数: Odd(i - 1)
   *   - 当前数为偶数: Even(i - 1) + 1
   */
  let ans = 0,
    odd = 0,
    even = 0,
    P = 10 ** 9 + 7;

  for (const n of arr) {
    let curOdd = n % 2 === 0 ? odd : even + 1,
      curEven = n % 2 === 0 ? even + 1 : odd;

    ans += curOdd;
    ans %= P;
    [odd, even] = [curOdd, curEven];
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numOfSubarrays
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,3,5,5,10,4,5,1,2,5,4,10,21,21]\n
// @lcpr case=end

// @lcpr case=start
// [2,4,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7]\n
// @lcpr case=end

// @lcpr case=start
// [100,100,99,99]\n
// @lcpr case=end

// @lcpr case=start
// [7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numOfSubarrays;
// @lcpr-after-debug-end

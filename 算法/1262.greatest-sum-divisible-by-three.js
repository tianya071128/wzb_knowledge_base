/*
 * @lc app=leetcode.cn id=1262 lang=javascript
 * @lcpr version=30204
 *
 * [1262] 可被三整除的最大和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSumDivThree = function (nums) {
  /**
   * 贪心:
   *  1. 将所有数求和
   *      - 正好能被 3 整除
   *      - 与 3 取模剩 1
   *         - 去除一个取模剩 1 的 --> 越小越好
   *         - 或者去除两个取模剩 2 的 --> 越小越好
   *      - 与 3 取模剩 2
   *         - 去除一个取模剩 2 的 --> 越小越好
   *         - 或者去除两个取模剩 1 的 --> 越小越好
   */
  let ans = 0,
    list = [
      [Infinity, Infinity],
      [Infinity, Infinity],
    ];
  for (const n of nums) {
    ans += n;
    if (n % 3 === 1) {
      if (list[0][1] > n) {
        list[0][1] = n;
      }

      // 交换位置
      if (list[0][0] > list[0][1])
        [list[0][0], list[0][1]] = [list[0][1], list[0][0]];
    } else if (n % 3 === 2) {
      if (list[1][1] > n) {
        list[1][1] = n;
      }

      // 交换位置
      if (list[1][0] > list[1][1])
        [list[1][0], list[1][1]] = [list[1][1], list[1][0]];
    }
  }

  // 与 3 取模剩 1
  //  - 去除一个取模剩 1 的 --> 越小越好
  //  - 或者去除两个取模剩 2 的 --> 越小越好
  if (ans % 3 === 1) {
    ans -= Math.min(list[0][0], list[1][0] + list[1][1]);
  }
  // 与 3 取模剩 2
  //  - 去除一个取模剩 2 的 --> 越小越好
  //  - 或者去除两个取模剩 1 的 --> 越小越好
  else if (ans % 3 === 2) {
    ans -= Math.min(list[1][0], list[0][0] + list[0][1]);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxSumDivThree
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [3,6,5,1,8]\n
// @lcpr case=end

// @lcpr case=start
// [4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxSumDivThree;
// @lcpr-after-debug-end

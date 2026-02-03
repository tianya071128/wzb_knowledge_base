/*
 * @lc app=leetcode.cn id=1395 lang=javascript
 * @lcpr version=30204
 *
 * [1395] 统计作战单位数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} rating
 * @return {number}
 */
var numTeams = function (rating) {
  /**
   * 每一项存储
   *   - 比当前项小的值数量
   *   - 比当前项大的值数量
   *
   * 动态规划
   *  结果 += Sum(f(1..i-1) > f(i) ? f(1..i-1)[当前项值大的数量] : f(1..i-1)[当前项值小的数量])
   */

  let dp = Array.from({ length: rating.length }, () => [0, 0]),
    ans = 0;

  for (let i = 1; i < rating.length; i++) {
    let min = 0,
      max = 0,
      cur = rating[i];

    for (let j = i - 1; j >= 0; j--) {
      let item = rating[j];
      ans += item < cur ? dp[j][0] : dp[j][1];

      if (item < cur) {
        min++;
      } else {
        max++;
      }
    }

    dp[i] = [min, max];
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numTeams
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [2,5,3,4,6,10,89,20,14,52,15,47,86,12,102,454,781,7785,1455,4511,25454]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numTeams;
// @lcpr-after-debug-end

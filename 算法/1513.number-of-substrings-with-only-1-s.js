/*
 * @lc app=leetcode.cn id=1513 lang=javascript
 * @lcpr version=30204
 *
 * [1513] 仅含 1 的子串数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var numSub = function (s) {
  // 转换思路: 求出连接 1 的个数的阶乘之和
  let ans = 0,
    n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '1') {
      n++;
      if (s[i + 1] !== '1') {
        ans += ((n + 1) * n) / 2;

        n = 0;
      }
    }
  }

  return ans % (10 ** 9 + 7);
};
// @lc code=end

/*
// @lcpr case=start
// "0110111"\n
// @lcpr case=end

// @lcpr case=start
// "101"\n
// @lcpr case=end

// @lcpr case=start
// "111111"\n
// @lcpr case=end

// @lcpr case=start
// "000"\n
// @lcpr case=end

 */

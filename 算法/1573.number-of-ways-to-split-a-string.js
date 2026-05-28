/*
 * @lc app=leetcode.cn id=1573 lang=javascript
 * @lcpr version=30204
 *
 * [1573] 分割字符串的方案数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var numWays = function (s) {
  // 先计算全部1的个数, 以及 1 的索引
  // 计算每个字符串需要分多少个的1
  // 计算左侧满足1的个数之后的索引, 同时计算中间的左边界第一个1的索引
  //   之间存在的0的个数, 就是左边的可能性
  // 计算右侧满足1的个数之后的索引
  //   之间存在的0的个数, 就是右边的可能性
  // 两者相乘即为结果

  let count = [],
    MOD = 10 ** 9 + 7;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '1') count.push(i);
  }

  // 特殊情况: 全为 0
  if (count.length === 0) return (((s.length - 1) * (s.length - 2)) / 2) % MOD;

  // 如果不能均分为 3 个, 那么直接返回 0
  if (count.length % 3 !== 0) return 0;

  let average = count.length / 3,
    l = count[average - 1],
    centerL = count[average],
    r = count[count.length - average],
    centerR = count[count.length - average - 1];

  return ((centerL - l) * (r - centerR)) % MOD;
};
// @lc code=end

/*
// @lcpr case=start
// "10101"\n
// @lcpr case=end

// @lcpr case=start
// "1001"\n
// @lcpr case=end

// @lcpr case=start
// "0000000000000000"\n
// @lcpr case=end

// @lcpr case=start
// "100100100100010100110010100110100100010100110100100010100110100100010100110"\n
// @lcpr case=end

 */

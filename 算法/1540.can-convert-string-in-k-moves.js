/*
 * @lc app=leetcode.cn id=1540 lang=javascript
 * @lcpr version=30204
 *
 * [1540] K 次操作转变字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @param {number} k
 * @return {boolean}
 */
var canConvertString = function (s, t, k) {
  if (s.length !== t.length) return false;

  // 先计算能转化次数的个数
  // 其中, 如果超过 26 次的话, 那么就是一个周期, 多个周期中次数都加1
  let cycle = Math.floor(k / 26),
    mod = k % 26,
    frequencys = Array.from({ length: 27 }, (item, index) => {
      return cycle + (index <= mod ? 1 : 0);
    });

  // 计算两个字符之间需要多少次的转换
  for (let i = 0; i < s.length; i++) {
    let num = t[i].charCodeAt() - s[i].charCodeAt() + (t[i] < s[i] ? 26 : 0);

    if (num > 0 && frequencys[num]-- <= 0) return false;
  }

  return true;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=canConvertString
// paramTypes= ["string","string","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "h"\n"a"\n18\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n"bcd"\n100\n
// @lcpr case=end

// @lcpr case=start
// "aab"\n"bbb"\n27\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canConvertString;
// @lcpr-after-debug-end

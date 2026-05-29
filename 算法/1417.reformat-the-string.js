/*
 * @lc app=leetcode.cn id=1417 lang=javascript
 * @lcpr version=30204
 *
 * [1417] 重新格式化字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reformat = function (s) {
  // 将数字和字母分为两个变量存储
  let s1 = '',
    s2 = '';
  for (const item of s) {
    if (/\d/.test(item)) {
      s1 += item;
    } else {
      s2 += item;
    }
  }

  // 如果数量相差 1 个以上, 肯定无法满足
  if (Math.abs(s1.length - s2.length) > 1) return '';

  // 组成结果
  let ans = '';
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    ans += s1[i] + s2[i];
  }

  // 处理多余的一个字符
  if (s1.length > s2.length) {
    ans += s1[s1.length - 1];
  } else if (s1.length < s2.length) {
    ans = s2[s2.length - 1] + ans;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "a0b1c2"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

// @lcpr case=start
// "1229857369"\n
// @lcpr case=end

// @lcpr case=start
// "covid2019"\n
// @lcpr case=end

// @lcpr case=start
// "ab123"\n
// @lcpr case=end

 */

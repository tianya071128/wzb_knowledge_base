/*
 * @lc app=leetcode.cn id=1309 lang=javascript
 * @lcpr version=30204
 *
 * [1309] 解码字母到整数映射
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var freqAlphabets = function (s) {
  let hash = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
    9: 'i',
    '10#': 'j',
    '11#': 'k',
    '12#': 'l',
    '13#': 'm',
    '14#': 'n',
    '15#': 'o',
    '16#': 'p',
    '17#': 'q',
    '18#': 'r',
    '19#': 's',
    '20#': 't',
    '21#': 'u',
    '22#': 'v',
    '23#': 'w',
    '24#': 'x',
    '25#': 'y',
    '26#': 'z',
  };

  let ans = '';
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === '#') {
      // 提取前一位和前二位
      let n1 = Number(s[i - 1] ?? '0'),
        n2 = Number(s[i - 2] ?? '0');

      if (n2 * 10 + n1 <= 26 && n2 * 10 + n1 >= 10) {
        ans = hash[n2 * 10 + n1 + s[i]] + ans;
        i -= 2;
      } else {
        ans = hash[n1 + s[i]] + ans;
        i--;
      }
    } else {
      ans = hash[s[i]] + ans;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=freqAlphabets
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"\n
// @lcpr case=end

// @lcpr case=start
// "1326#"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = freqAlphabets;
// @lcpr-after-debug-end

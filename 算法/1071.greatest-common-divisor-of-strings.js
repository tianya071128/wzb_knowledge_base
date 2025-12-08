/*
 * @lc app=leetcode.cn id=1071 lang=javascript
 * @lcpr version=30204
 *
 * [1071] 字符串的最大公因子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
var gcdOfStrings = function (str1, str2) {
  let minStr = str1.length <= str2.length ? str1 : str2,
    maxStr = str1.length > str2.length ? str1 : str2;

  // 此时可以提前判断
  if (!maxStr.startsWith(minStr)) return '';

  // 从短的字符开始判断因子
  for (let i = 1; i <= minStr.length; i++) {
    if (minStr.length % i === 0) {
      let cd = minStr.slice(0, minStr.length / i);
      if (checkCd(cd, minStr) && checkCd(cd, maxStr)) {
        return cd;
      }
    }
  }

  return '';
};
/**
 * @param {string} str1 因子
 * @param {string} str2 检测字符
 * @return {boolean}
 */
var checkCd = (str1, str2) => {
  let position = 0;
  while (position < str2.length) {
    let res = str2.indexOf(str1, position);

    if (res !== position) return false;

    position += str1.length;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "ABCABC"\n"ABC"\n
// @lcpr case=end

// @lcpr case=start
// "ABABAB"\n"ABAB"\n
// @lcpr case=end

// @lcpr case=start
// "LEET"\n"CODE"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = gcdOfStrings;
// @lcpr-after-debug-end

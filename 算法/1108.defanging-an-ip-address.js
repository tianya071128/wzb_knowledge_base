/*
 * @lc app=leetcode.cn id=1108 lang=javascript
 * @lcpr version=30204
 *
 * [1108] IP 地址无效化
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} address
 * @return {string}
 */
var defangIPaddr = function (address) {
  let ans = '';

  for (const s of address) {
    if (s === '.') {
      ans += '[' + '.' + ']';
    } else {
      ans += s;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "1.1.1.1"\n
// @lcpr case=end

// @lcpr case=start
// "255.100.50.0"\n
// @lcpr case=end

 */

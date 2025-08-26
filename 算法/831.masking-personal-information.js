/*
 * @lc app=leetcode.cn id=831 lang=javascript
 * @lcpr version=30204
 *
 * [831] 隐藏个人信息
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var maskPII = function (s) {
  const i = s.indexOf('@');
  if (i >= 0) {
    // 电子邮箱
    return `${s[0]}*****${s.slice(i - 1)}`.toLocaleLowerCase();
  } else {
    // 手机号
    let mobile = s.replaceAll(/\D/g, '');
    let prefix = ['***-***-', '+*-***-***-', '+**-***-***-', '+***-***-***-'];

    return `${prefix[mobile.length - 10]}${mobile.slice(mobile.length - 4)}`;
  }
};
// @lc code=end

/*
// @lcpr case=start
// "LeetCode@LeetCode.com"\n
// @lcpr case=end

// @lcpr case=start
// "AB@qq.com"\n
// @lcpr case=end

// @lcpr case=start
// "11(234)567-890"\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=482 lang=javascript
 * @lcpr version=30204
 *
 * [482] 密钥格式化
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var licenseKeyFormatting = function (s, k) {
  s = s.toLocaleUpperCase();

  // 从后往前遍历
  let ans = '',
    n = k;
  for (let i = s.length - 1; i > -1; i--) {
    const item = s[i];

    // 破折号不处理
    if (item === '-') continue;

    if (n === 0) {
      ans = '-' + ans;
      n = k;
    }

    n--;
    ans = item + ans;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "5F3Z-2e-9-w"\n4\n
// @lcpr case=end

// @lcpr case=start
// "2-5g-3-J"\n2\n
// @lcpr case=end

 */

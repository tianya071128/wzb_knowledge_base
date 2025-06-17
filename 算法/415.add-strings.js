/*
 * @lc app=leetcode.cn id=415 lang=javascript
 * @lcpr version=30204
 *
 * [415] 字符串相加
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
  let carry = 0,
    pointer1 = num1.length - 1,
    pointer2 = num2.length - 1,
    ans = '';

  while (pointer1 >= 0 || pointer2 >= 0) {
    let n =
      Number(num1[pointer1] ?? '0') + Number(num2[pointer2] ?? '0') + carry;

    carry = n > 9 ? 1 : 0;
    n = n > 9 ? n - 10 : n;
    pointer1--;
    pointer2--;

    ans = String(n) + ans;
  }

  // 处理最后进位
  if (carry) ans = '1' + ans;

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "11"\n"123"\n
// @lcpr case=end

// @lcpr case=start
// "456"\n"77"\n
// @lcpr case=end

// @lcpr case=start
// "0"\n"0"\n
// @lcpr case=end

 */

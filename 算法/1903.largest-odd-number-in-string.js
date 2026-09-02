/*
 * @lc app=leetcode.cn id=1903 lang=javascript
 * @lcpr version=30204
 *
 * [1903] 字符串中的最大奇数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num
 * @return {string}
 */
var largestOddNumber = function (num) {
  /** 是否为奇数只看最后一位, 只要最后一位是奇数, 那么就是奇数 */
  for (let i = num.length - 1; i >= 0; i--) {
    if (Number(num[i]) % 2 === 1) {
      return num.slice(0, i + 1);
    }
  }

  return '';
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=largestOddNumber
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "52"\n
// @lcpr case=end

// @lcpr case=start
// "4206"\n
// @lcpr case=end

// @lcpr case=start
// "35427"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = largestOddNumber;
// @lcpr-after-debug-end

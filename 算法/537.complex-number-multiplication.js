/*
 * @lc app=leetcode.cn id=537 lang=javascript
 * @lcpr version=30204
 *
 * [537] 复数乘法
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var complexNumberMultiply = function (num1, num2) {
  // 模拟运算 - 提取出四个数字来运算
  let list1 = num1.split('+').map((item) => parseInt(item)),
    list2 = num2.split('+').map((item) => parseInt(item));

  return `${list1[0] * list2[0] + list1[1] * list2[1] * -1}+${
    list1[1] * list2[0] + list1[0] * list2[1]
  }i`;
};
// @lc code=end

/*
// @lcpr case=start
// "1+1i"\n"1+1i"\n
// @lcpr case=end

// @lcpr case=start
// "1+-1i"\n"1+-1i"\n
// @lcpr case=end

 */

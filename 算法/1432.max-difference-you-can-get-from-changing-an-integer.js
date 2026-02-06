/*
 * @lc app=leetcode.cn id=1432 lang=javascript
 * @lcpr version=30204
 *
 * [1432] 改变一个整数能得到的最大差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @return {number}
 */
var maxDiff = function (num) {
  /**
   * 贪心:
   *  - 将最高位调到最大或最小
   *  - 如果最高位已经是最大或最小, 则依次往后查找
   */
  let min = 0,
    max = 0;

  // 确定最大值
  let list = String(num).split(''),
    n; // 更改值
  for (let i = 0; i < list.length; i++) {
    let item = list[i];

    if (!n && item !== '9') {
      n = item;
    }

    max = max * 10 + Number(item === n ? '9' : item);
  }

  // 确定最小值
  let afterN; // 更新之后的值, 可能是 0, 也可能是 1
  n = void 0;
  for (let i = 0; i < list.length; i++) {
    let item = list[i];

    if (!n && item !== '1' && item !== '0') {
      n = item;
      afterN = i === 0 ? '1' : '0';
    }

    min = min * 10 + Number(item === n ? afterN : item);
  }

  return max - min;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxDiff
// paramTypes= ["number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 111\n
// @lcpr case=end

// @lcpr case=start
// 1101057\n
// @lcpr case=end

// @lcpr case=start
// 123456\n
// @lcpr case=end

// @lcpr case=start
// 10000\n
// @lcpr case=end

// @lcpr case=start
// 9288\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxDiff;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=670 lang=javascript
 * @lcpr version=30204
 *
 * [670] 最大交换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 *  优化: 在第一步中, 就可以记录下需要交换的索引
 *
 * @param {number} num
 * @return {number}
 */
var maximumSwap = function (num) {
  /**
   * 分析题意可知: 只要更大的值在前面就会更大
   *  1. 所以从右往左迭代, 记录下当前索引的最大值以及最大值索引
   *  2. 从左往右迭代, 只要上一个记录的最大值不是当前位置, 那么执行交换
   */
  const arr = [];
  // 0. 转换为数组计算
  while (num >= 10) {
    arr.unshift({
      n: num % 10,
      maxIndex: -1,
    });
    num = Math.floor(num / 10);
  }
  arr.unshift({
    n: num,
    maxIndex: -1,
  });

  // 1. 从右往左迭代记录最大值索引
  let max = -Infinity,
    maxIndex = -1;
  for (let i = arr.length - 1; i >= 0; i--) {
    const n = arr[i].n;

    if (n === max) {
      arr[i].maxIndex = i;
      continue;
    }
    if (n >= max) {
      max = n;
      maxIndex = i;
    }

    arr[i].maxIndex = maxIndex;
  }

  // 从左往右迭代
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].maxIndex !== i) {
      [arr[i], arr[arr[i].maxIndex]] = [arr[arr[i].maxIndex], arr[i]];
      break;
    }
  }

  return arr.reduce((total, item) => total * 10 + item.n, 0);
};
// @lc code=end

/*
// @lcpr case=start
// 10909091\n
// @lcpr case=end

// @lcpr case=start
// 1993\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maximumSwap;
// @lcpr-after-debug-end

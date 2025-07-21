/*
 * @lc app=leetcode.cn id=738 lang=javascript
 * @lcpr version=30204
 *
 * [738] 单调递增的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var monotoneIncreasingDigits = function (n) {
  /**
   * 观察如下:
   *  1. 41564 --> 39999    最高位降1, 其他位变成 9
   *  2. 332   --> 299      最高位降1, 其他位变成 9
   *
   * 所以需要找到降位的索引:
   *  1. 当前位比下一位要高
   *       1.1 此时往左找到等于当前位最左边的索引
   */
  let arr = String(n).split(''),
    i = 0;

  for (; i < arr.length; i++) {
    const cur = arr[i];

    if (arr[i + 1] && cur > arr[i + 1]) {
      // 往左找到
      while (arr[i] === arr[i - 1]) {
        i--;
      }

      break;
    }
  }

  // 找到了当前索引
  if (i < arr.length) {
    arr[i] = String(Number(arr[i]) - 1);
    for (let j = i + 1; j < arr.length; j++) {
      arr[j] = '9';
    }
  }

  return Number(arr.join(''));
};
// @lc code=end

/*
// @lcpr case=start
// 458145\n
// @lcpr case=end

// @lcpr case=start
// 1234\n
// @lcpr case=end

// @lcpr case=start
// 33311112\n
// @lcpr case=end

 */

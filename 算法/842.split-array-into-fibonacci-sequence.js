/*
 * @lc app=leetcode.cn id=842 lang=javascript
 * @lcpr version=30204
 *
 * [842] 将数组拆分成斐波那契序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num
 * @return {number[]}
 */
var splitIntoFibonacci = function (num) {
  /**
   * 回溯, 穷举所有可能性
   */
  let max = 2 ** 31;

  function checkFibonacci(start, n1, n2) {
    let res = [n1, n2];
    while (start < num.length) {
      let n3 = res.at(-2) + res.at(-1);

      // 不符合条件, 返回 false
      if (n3 >= max || !num.startsWith(String(n3), start)) return [];

      start += String(n3).length;
      res.push(n3);
    }

    return res;
  }

  for (let i = 0; i < num.length - 1; i++) {
    let s1 = num.slice(0, i + 1),
      n1 = Number(s1);

    // 超出最大值 || 以 0 开头 || 超过最大数量限制, 提前退出
    if (n1 >= max || s1 !== String(n1) || s1.length >= num.length / 2) break;

    for (let j = i + 1; j < num.length - 1; j++) {
      let s2 = num.slice(i + 1, j + 1),
        n2 = Number(s2);

      // 剩余宽度都不够
      if (
        n2 >= max ||
        s2 !== String(n2) ||
        Math.max(s1.length, s2.length) > num.length - j - 1
      )
        break;

      let res = checkFibonacci(j + 1, n1, n2);
      if (res.length) return res;
    }
  }

  return [];
};

// @lc code=end

/*
// @lcpr case=start
// "1101111"\n
// @lcpr case=end

// @lcpr case=start
// "112358130"\n
// @lcpr case=end

// @lcpr case=start
// "0123"\n
// @lcpr case=end

 */

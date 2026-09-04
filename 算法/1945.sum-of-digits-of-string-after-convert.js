/*
 * @lc app=leetcode.cn id=1945 lang=javascript
 * @lcpr version=30204
 *
 * [1945] 字符串转化后的各位数字之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var getLucky = function (s, k) {
  /** @type {number} 结果 */
  let ans = 0;

  /**
   * 转换数字位数相加
   * @param {number} n
   * @return {number}
   */
  function helper(n) {
    let ans = 0;
    while (n > 0) {
      ans += n % 10;
      n = Math.floor(n / 10);
    }

    return ans;
  }

  /** 直接先转换 s 一层 */
  for (const item of s) {
    ans += helper(item.charCodeAt() - 'a'.charCodeAt() + 1);
  }

  /** 根据 k 转换 */
  for (let i = 2; i <= k; i++) {
    ans = helper(ans);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "iiii"\n1\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n2\n
// @lcpr case=end

// @lcpr case=start
// "zbax"\n2\n
// @lcpr case=end

 */

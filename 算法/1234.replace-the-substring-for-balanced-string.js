/*
 * @lc app=leetcode.cn id=1234 lang=javascript
 * @lcpr version=30204
 *
 * [1234] 替换子串得到平衡字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var balancedString = function (s) {
  /**
   * 计算每个字母的溢出(超过 s.length / 4)个数, 只要子串中的字符大于这些溢出的字符
   *
   *  - 假设 Q 溢出 5, W 溢出 2
   *  - 子串中 "QQWWQWQQ" --> 将 溢出的转换为其他少的字符, 多余的保持不变即可
   */
  let overflowNum = [
      (s.length / 4) * -1,
      (s.length / 4) * -1,
      (s.length / 4) * -1,
      (s.length / 4) * -1,
    ],
    indexMap = new Map([
      ['Q', 0],
      ['W', 1],
      ['E', 2],
      ['R', 3],
    ]);

  for (const item of s) {
    overflowNum[indexMap.get(item)]++;
  }

  // 滑动窗口
  let ans = s.length,
    l = 0,
    r = -1,
    windowNum = [0, 0, 0, 0];
  while (r < s.length) {
    // 移动右指针
    while (r < s.length && windowNum.some((item, i) => item < overflowNum[i])) {
      r++;
      windowNum[indexMap.get(s[r])]++;
    }

    // 超出边界
    if (r >= s.length) return ans;

    // 计算窗口大小
    ans = Math.min(ans, r - l + 1);

    // 提前结束
    if (ans < 2) return ans;

    // 移动左指针
    windowNum[indexMap.get(s[l])]--;
    l++;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=balancedString
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "QWER"\n
// @lcpr case=end

// @lcpr case=start
// "QQWE"\n
// @lcpr case=end

// @lcpr case=start
// "QQQW"\n
// @lcpr case=end

// @lcpr case=start
// "QQQQ"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = balancedString;
// @lcpr-after-debug-end

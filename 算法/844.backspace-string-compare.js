/*
 * @lc app=leetcode.cn id=844 lang=javascript
 * @lcpr version=30204
 *
 * [844] 比较含退格的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var backspaceCompare = function (s, t) {
  /**
   * 从右往左遍历，遇到 # 则去除字符
   */
  let p1 = s.length - 1,
    p2 = t.length - 1;
  while (p1 >= 0 || p2 >= 0) {
    // 检测是否碰到 #
    let back = 0;
    while (s[p1] === '#' || back > 0) {
      if (s[p1] === '#') {
        back++;
      } else {
        back--;
      }
      p1--;
    }

    // 继续检测第二个字符
    back = 0;
    while (t[p2] === '#' || back > 0) {
      if (t[p2] === '#') {
        back++;
      } else {
        back--;
      }
      p2--;
    }

    // 比较指针所指向的位置字符是否相同
    if (s[p1] !== t[p2]) return false;

    p1--;
    p2--;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "ab#c"\n"ad#c"\n
// @lcpr case=end

// @lcpr case=start
// "ab##"\n"c#d#"\n
// @lcpr case=end

// @lcpr case=start
// "a#c"\n"b"\n
// @lcpr case=end

 */

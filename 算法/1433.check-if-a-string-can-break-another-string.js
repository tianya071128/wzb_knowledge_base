/*
 * @lc app=leetcode.cn id=1433 lang=javascript
 * @lcpr version=30204
 *
 * [1433] 检查一个字符串是否可以打破另一个字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkIfCanBreak = function (s1, s2) {
  /**
   * 1. 将 s1 和 s2 升序排列
   * 2. 每个字符比对, 确定一个方向
   * 3. 排序后: 同一个位置比对, 如果 s1 的字符比 s2 的字符大(小), 那么只有后续所有的字符都比同位置的 s2 都大(小)才行
   */
  s1 = s1.split('').sort().join('');
  s2 = s2.split('').sort().join('');

  let direction;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] === s2[[i]]) continue;

    let curDirection = s1[i] > s2[i];
    if (direction == undefined) {
      direction = curDirection;
    } else if (curDirection !== direction) {
      return false;
    }
  }

  return true;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=checkIfCanBreak
// paramTypes= ["string","string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abc"\n"xya"\n
// @lcpr case=end

// @lcpr case=start
// "abe"\n"acd"\n
// @lcpr case=end

// @lcpr case=start
// "leetcodee"\n"interview"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkIfCanBreak;
// @lcpr-after-debug-end

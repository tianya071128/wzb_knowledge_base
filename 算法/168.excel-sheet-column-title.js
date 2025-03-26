/*
 * @lc app=leetcode.cn id=168 lang=javascript
 * @lcpr version=30204
 *
 * [168] Excel 表列名称
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} columnNumber
 * @return {string}
 */
var convertToTitle = function (columnNumber) {
  const s = [
    'X',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  let ans = '';
  let base = 0;
  // while (columnNumber > 0) {
  //   base++;
  // }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 28\n
// @lcpr case=end

// @lcpr case=start
// 702\n
// @lcpr case=end

// @lcpr case=start
// 2147483647\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = convertToTitle;
// @lcpr-after-debug-end

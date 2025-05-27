/*
 * @lc app=leetcode.cn id=423 lang=javascript
 * @lcpr version=30204
 *
 * [423] 从英文中重建数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var originalDigits = function (s) {
  /**
   *  数字       英文           独有字符
   *   0    -    zero     --->   z
   *   1    -    one      --->   当 0、2、4 处理后, o是独有的
   *   2    -    two      --->   w
   *   3    -    three    --->   当 8 处理后, h是独有的
   *   4    -    four     --->   u
   *   5    -    five     --->   当 4 处理后, f是独有的
   *   6    -    six      --->   x
   *   7    -    seven    --->   当 6 处理后, s是独有的
   *   8    -    eight    --->   g
   *   9    -    nine     --->   最后处理的
   */
  // 先使用 map 表映射字符数量
  const map = {},
    ans = new Array(10).fill(0);
  for (const item of s) {
    map[item] = (map[item] ?? 0) + 1;
  }

  // 2. 在根据独有字符来判断个数
  const arr = [
    ['z', 'zero', 0],
    ['w', 'two', 2],
    ['u', 'four', 4],
    ['x', 'six', 6],
    ['g', 'eight', 8],
    ['h', 'three', 3],
    ['f', 'five', 5],
    ['s', 'seven', 7],
    ['o', 'one', 1],
    ['i', 'nine', 9],
  ];
  for (const [s, str, i] of arr) {
    // 存在该字符
    const num = map[s];
    if (num) {
      ans[i] = num;

      // 清除英文对应字符
      for (const item of str) {
        map[item] -= num;
      }
    }
  }

  return ans.reduce(
    (total, item, index) => total + new Array(item).fill(index).join(''),
    ''
  );
};
// @lc code=end

/*
// @lcpr case=start
// "owoztneoer"\n
// @lcpr case=end

// @lcpr case=start
// "fviefuro"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = originalDigits;
// @lcpr-after-debug-end

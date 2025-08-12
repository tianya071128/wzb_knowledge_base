/*
 * @lc app=leetcode.cn id=816 lang=javascript
 * @lcpr version=30204
 *
 * [816] 模糊坐标
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string[]}
 */
var ambiguousCoordinates = function (s) {
  /**
   * 1. 先分为两个数字
   * 2. 在对两个数字进行小数点的拆分
   * 3. 得到左右两个数字的所有可能
   */
  let ans = [];
  function getNumList(s) {
    let ans = [s];
    for (let i = 1; i < s.length; i++) {
      ans.push(`${s.slice(0, i)}.${s.slice(i)}`);
    }

    // 返回符合条件的
    return ans.filter((item) => String(Number(item)) === item);
  }

  for (let end = 2; end <= s.length - 2; end++) {
    let left = s.slice(1, end),
      right = s.slice(end, s.length - 1);

    // 对左右字符串拆分出所有可能得组合数字
    let leftList = getNumList(left),
      rightList = getNumList(right);

    for (const item of leftList) {
      for (const item2 of rightList) {
        ans.push(`(${item}, ${item2})`);
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "(123)"\n
// @lcpr case=end

// @lcpr case=start
// "(00011)"\n
// @lcpr case=end

// @lcpr case=start
// "(0123)"\n
// @lcpr case=end

// @lcpr case=start
// "(100)"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = ambiguousCoordinates;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=1090 lang=javascript
 * @lcpr version=30204
 *
 * [1090] 受标签影响的最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} values
 * @param {number[]} labels
 * @param {number} numWanted
 * @param {number} useLimit
 * @return {number}
 */
var largestValsFromLabels = function (values, labels, numWanted, useLimit) {
  /**
   * 贪心
   *  - 先进行排序, 每次尽可能取得分高的项
   */
  let ans = 0,
    /** @type {[number, number][]} [值, 项], 降序后的 */
    arr = new Array(values.length)
      .fill(0)
      .map((item, i) => [values[i], labels[i]])
      .sort((a, b) => b[0] - a[0]),
    /** @type {Map<number, number>} 每项使用的个数 */
    used = new Map();

  for (const [value, label] of arr) {
    let n = used.get(label) ?? 0;

    // 可以使用
    if (n < useLimit) {
      ans += value;
      used.set(label, n + 1);
      numWanted--;

      if (numWanted <= 0) break;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,3,2,1]\n[1,1,2,2,3]\n3\n1\n
// @lcpr case=end

// @lcpr case=start
// [5,4,3,2,1]\n[1,3,3,3,2]\n3\n2\n
// @lcpr case=end

// @lcpr case=start
// [9,8,8,7,6]\n[0,0,0,1,1]\n3\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = largestValsFromLabels;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=2191 lang=javascript
 * @lcpr version=30204
 *
 * [2191] 将杂乱无章的数字排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} mapping
 * @param {number[]} nums
 * @return {number[]}
 */
var sortJumbled = function (mapping, nums) {
  /**
   * 使用 hash 存储已解析的结果
   */
  let hash = new Map();

  /**
   * @param {number} n 原始数字
   */
  function helper(n) {
    if (hash.has(n)) return hash.get(n);

    return String(n)
      .split('')
      .map((item) => mapping[item])
      .reduce((total, item) => total * 10 + item);
  }

  return nums.sort((a, b) => helper(a) - helper(b));
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=sortJumbled
// paramTypes= ["number[]","number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [8,9,4,0,2,1,3,5,7,6]\n[991,338,38]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,3,4,5,6,7,8,9]\n[789,456,123]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = sortJumbled;
// @lcpr-after-debug-end

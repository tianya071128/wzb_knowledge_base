/*
 * @lc app=leetcode.cn id=1636 lang=javascript
 * @lcpr version=30204
 *
 * [1636] 按照频率将数组升序排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var frequencySort = function (nums) {
  /** @type {Map<number, number>} 数字个数 */
  let hash = new Map();

  for (const n of nums) {
    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  nums.sort((a, b) => {
    if (hash.get(a) > hash.get(b)) {
      return 1;
    }

    if (hash.get(a) === hash.get(b) && a < b) {
      return 1;
    }

    return -1;
  });

  return nums;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2,2,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,3,1,3,2]\n
// @lcpr case=end

// @lcpr case=start
// [-1,1,-6,4,5,-6,1,4,1]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1346 lang=javascript
 * @lcpr version=30204
 *
 * [1346] 检查整数及其两倍数是否存在
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var checkIfExist = function (arr) {
  let hash = new Set();

  for (const n of arr) {
    if (hash.has(n / 2) || hash.has(n * 2)) return true;

    hash.add(n);
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [10,2,5,3]\n
// @lcpr case=end

// @lcpr case=start
// [7,1,14,11]\n
// @lcpr case=end

// @lcpr case=start
// [3,1,7,11]\n
// @lcpr case=end

 */

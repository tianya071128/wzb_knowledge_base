/*
 * @lc app=leetcode.cn id=1394 lang=javascript
 * @lcpr version=30204
 *
 * [1394] 找出数组中的幸运数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var findLucky = function (arr) {
  let hash = new Map();
  for (const i of arr) {
    hash.set(i, (hash.get(i) ?? 0) + 1);
  }

  let ans = -1;
  for (const [k, v] of hash) {
    if (k === v && ans < k) {
      ans = k;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2,3,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [5]\n
// @lcpr case=end

// @lcpr case=start
// [7,7,7,7,7,7,7]\n
// @lcpr case=end

 */

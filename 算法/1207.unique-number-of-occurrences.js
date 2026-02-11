/*
 * @lc app=leetcode.cn id=1207 lang=javascript
 * @lcpr version=30204
 *
 * [1207] 独一无二的出现次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var uniqueOccurrences = function (arr) {
  // -1000 <= arr[i] <= 1000   --> 范围比较小, 直接使用数组计数
  let res = new Array(2001).fill(0);
  for (const n of arr) {
    res[n + 1000]++;
  }

  let hash = new Set();
  for (const n of res) {
    if (n !== 0) {
      if (hash.has(n)) return false;
      hash.add(n);
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,1,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

// @lcpr case=start
// [-3,0,1,-3,1,1,1,-3,10,0]\n
// @lcpr case=end

 */

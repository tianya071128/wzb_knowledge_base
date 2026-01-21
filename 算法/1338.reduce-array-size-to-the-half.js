/*
 * @lc app=leetcode.cn id=1338 lang=javascript
 * @lcpr version=30204
 *
 * [1338] 数组大小减半
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var minSetSize = function (arr) {
  // 计数
  let hash = new Map();
  for (const n of arr) {
    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  // 排序
  let list = [...hash.values()].sort((a, b) => b - a),
    total = arr.length / 2,
    ans = 0;

  for (const n of list) {
    total -= n;
    ans++;

    if (total <= 0) break;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minSetSize
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [9,77,63,22,92,9,14,54,8,38,18,19,38,68,58,19]\n
// @lcpr case=end

// @lcpr case=start
// [7,7,7,7,7,7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minSetSize;
// @lcpr-after-debug-end

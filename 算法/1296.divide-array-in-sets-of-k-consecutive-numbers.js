/*
 * @lc app=leetcode.cn id=1296 lang=javascript
 * @lcpr version=30204
 *
 * [1296] 划分数组为连续数字的集合
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var isPossibleDivide = function (nums, k) {
  if (nums.length % k !== 0) return false;

  nums.sort((a, b) => a - b);

  // 记录下各数字的个数
  let hash = new Map();
  for (const n of nums) {
    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  for (const n of nums) {
    if (hash.get(n) > 0) {
      // 从该起点开始处理 k 个值
      for (let i = n; i < n + k; i++) {
        // 组装失败
        if ((hash.get(i) ?? 0) <= 0) return false;

        hash.set(i, hash.get(i) - 1);
      }
    }
  }

  return true;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=isPossibleDivide
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,3,4,4,5,6]\n4\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1,2,3,4,3,4,5,9,10,11]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,4]\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isPossibleDivide;
// @lcpr-after-debug-end

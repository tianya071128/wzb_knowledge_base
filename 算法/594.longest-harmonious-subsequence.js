/*
 * @lc app=leetcode.cn id=594 lang=javascript
 * @lcpr version=30204
 *
 * [594] 最长和谐子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 无需进行排序, 直接遍历哈希键, 找到 键 + 1 的次数相加即可
 * @param {number[]} nums
 * @return {number}
 */
var findLHS = function (nums) {
  /**
   * 1. 遍历使用哈希表记录每个元素的出现次数
   * 2. 对哈希表的键进行排序
   * 3. 进行排序后前后元素的差值是否为1
   */
  let ans = 0,
    hash = new Map();
  for (const n of nums) {
    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  const list = [...hash.keys()].sort((a, b) => a - b);
  for (let i = 1; i < list.length; i++) {
    if (list[i] - list[i - 1] === 1) {
      ans = Math.max(ans, hash.get(list[i]) + hash.get(list[i - 1]));
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,2,2,5,2,3,7]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,1]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1748 lang=javascript
 * @lcpr version=30204
 *
 * [1748] 唯一元素的和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var sumOfUnique = function (nums) {
  /** @type {Map<number, number>} 哈希存储元素 */
  let hash = new Map(),
    /** @type {number} 结果 */
    ans = 0;

  for (const n of nums) {
    if (hash.has(n)) {
      if (hash.get(n) === 1) {
        ans -= n;
      }
    } else {
      ans += n;
    }

    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

 */

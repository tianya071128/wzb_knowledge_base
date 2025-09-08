/*
 * @lc app=leetcode.cn id=881 lang=javascript
 * @lcpr version=30204
 *
 * [881] 救生艇
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} people
 * @param {number} limit
 * @return {number}
 */
var numRescueBoats = function (people, limit) {
  /**
   * 贪心: 当载走最大体重的同时, 尽可能多带一个体重最小的
   */
  // 先排序
  people.sort((a, b) => a - b);

  // 双指针
  let ans = 0,
    left = 0,
    right = people.length - 1;
  while (left <= right) {
    // 当可以多带一个体重小的
    if (people[left] + people[right] <= limit) left++;
    right--;
    ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2]\n3\n
// @lcpr case=end

// @lcpr case=start
// [3,2,2,1,5,7,5,8,9,10,4,1,5]\n10\n
// @lcpr case=end

// @lcpr case=start
// [3,5,3,4]\n5\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numRescueBoats;
// @lcpr-after-debug-end

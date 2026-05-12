/*
 * @lc app=leetcode.cn id=1389 lang=javascript
 * @lcpr version=30204
 *
 * [1389] 按既定顺序创建目标数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number[]} index
 * @return {number[]}
 */
var createTargetArray = function (nums, index) {
  // 对 index 进行排序
  //  1. 索引越靠前, 先进行插入
  //  2. 索引一致的, 以后面的优先
  return index
    .map((i, j) => [i, nums[j], j])
    .sort((a, b) => (a[0] > b[0] || (a[0] > b[0] && a[2] < b[2]) ? 1 : -1))
    .map((item) => item[1]);
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,2,3,4]\n[0,1,2,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,0]\n[0,1,2,3,0]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,4,3,2]\n[0,0,1,3,1]\n
// @lcpr case=end

 */

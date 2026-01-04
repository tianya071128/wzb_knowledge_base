/*
 * @lc app=leetcode.cn id=2216 lang=javascript
 * @lcpr version=30204
 *
 * [2216] 美化数组的最少删除数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minDeletion = function (nums) {
  let prev,
    ans = 0;
  for (const item of nums) {
    if (prev == undefined) {
      prev = item;
    }
    // 满足条件, 进入下一个配对
    else if (item !== prev) {
      prev = undefined;
    }
    // 删除该元素
    else {
      ans++;
    }
  }

  return prev == undefined ? ans : ans + 1;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2,3,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,2,3,3]\n
// @lcpr case=end

 */

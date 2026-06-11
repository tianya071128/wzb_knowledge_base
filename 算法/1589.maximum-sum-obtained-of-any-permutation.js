/*
 * @lc app=leetcode.cn id=1589 lang=javascript
 * @lcpr version=30204
 *
 * [1589] 所有排列中的最大和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number[][]} requests
 * @return {number}
 */
var maxSumRangeQuery = function (nums, requests) {
  // 只要我们判断出每个位置的查询次数, 那么就只要将 nums 依次放在查询总次数上, 就是最大的总和
  // 利用等分数组计算查询区间的值

  let diff = Array(nums.length).fill(0); // 初始时等分都是 0
  for (const [start, end] of requests) {
    diff[start] += 1;
    end !== diff.length - 1 && (diff[end + 1] -= 1);
  }

  // 还原为数组
  for (let i = 1; i < diff.length; i++) {
    diff[i] += diff[i - 1];
  }

  // 将查询总和和原数组排序
  diff.sort((a, b) => b - a);
  nums.sort((a, b) => b - a);

  let ans = 0;
  for (let i = 0; i < diff.length; i++) {
    if (diff[i] === 0) break;

    ans += nums[i] * diff[i];
  }

  return ans % (10 ** 9 + 7);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxSumRangeQuery
// paramTypes= ["number[]","number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,4,5]\n[[1,3],[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6]\n[[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,10]\n[[0,2],[1,3],[1,1]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxSumRangeQuery;
// @lcpr-after-debug-end

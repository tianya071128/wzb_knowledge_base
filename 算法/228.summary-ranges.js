/*
 * @lc app=leetcode.cn id=228 lang=javascript
 * @lcpr version=30204
 *
 * [228] 汇总区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {string[]}
 */
var summaryRanges = function (nums) {
  let ans = [],
    start = null;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];

    // 检测与下一项是否为连接区间
    if (Math.abs(n - (nums[i + 1] ?? Infinity)) > 1) {
      ans.push(start != null ? `${start}->${n}` : `${n}`);
      start = null;
    }
    // 设置当前为起始
    else if (start == null) {
      start = n;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,2,4,5,7]\n
// @lcpr case=end

// @lcpr case=start
// [0,2,3,4,6,8,9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = summaryRanges;
// @lcpr-after-debug-end

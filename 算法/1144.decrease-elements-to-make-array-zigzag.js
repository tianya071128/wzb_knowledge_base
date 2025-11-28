/*
 * @lc app=leetcode.cn id=1144 lang=javascript
 * @lcpr version=30204
 *
 * [1144] 递减元素使数组呈锯齿状
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var movesToMakeZigzag = function (nums) {
  /**
   * 只有两种可能, 那么模拟这两种可能所需的步骤, 取最小值即可
   */

  /**
   * @param {1 | -1} position 初始方向
   */
  function helper(position) {
    let ans = 0,
      prev = nums[0];

    for (let i = 1; i < nums.length; i++) {
      let cur = nums[i];

      // 如果是向上的, 但是当前数比上一个数要小, 只能改变上一个值的数
      if (position === 1 && cur <= prev) {
        ans += prev - cur + 1;
      }
      // 如果是向下的, 但是当前数比上一个数要大, 只能改变当前数
      else if (position === -1 && cur >= prev) {
        ans += cur - prev + 1;
        cur = prev - 1;
      }

      position = position === 1 ? -1 : 1;
      prev = cur;
    }

    return ans;
  }

  return Math.min(helper(1), helper(-1));
};
// @lc code=end

/*
// @lcpr case=start
// [1,2]\n
// @lcpr case=end

// @lcpr case=start
// [9,6,9,6,1,6,2,1,9,6,1,9,6,1,6,245,6,26,2]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1344 lang=javascript
 * @lcpr version=30204
 *
 * [1344] 时钟指针的夹角
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} hour
 * @param {number} minutes
 * @return {number}
 */
var angleClock = function (hour, minutes) {
  let ans = Math.abs(
    (360 / 12) * ((hour % 12) + minutes / 60) - (360 / 60) * minutes
  );
  return ans > 180 ? 360 - ans : ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n57\n
// @lcpr case=end

// @lcpr case=start
// 3\n30\n
// @lcpr case=end

// @lcpr case=start
// 4\n50\n
// @lcpr case=end

// @lcpr case=start
// 12\n0\n
// @lcpr case=end

 */

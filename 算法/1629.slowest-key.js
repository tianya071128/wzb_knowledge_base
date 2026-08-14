/*
 * @lc app=leetcode.cn id=1629 lang=javascript
 * @lcpr version=30204
 *
 * [1629] 按键持续时间最长的键
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} releaseTimes
 * @param {string} keysPressed
 * @return {character}
 */
var slowestKey = function (releaseTimes, keysPressed) {
  /** @type {string} 上一个字符 */
  let ans = keysPressed[0],
    /** @type {number} 结果 */
    time = releaseTimes[0];
  for (let i = 1; i < releaseTimes.length; i++) {
    let cur = releaseTimes[i] - releaseTimes[i - 1];
    if (cur >= time) {
      if (cur > time || keysPressed[i] > ans) {
        ans = keysPressed[i];
      }

      time = cur;
    }
  }
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [9,29,49,50]\n"cbcd"\n
// @lcpr case=end

// @lcpr case=start
// [12,23,36,46,62]\n"spuda"\n
// @lcpr case=end

 */

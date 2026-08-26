/*
 * @lc app=leetcode.cn id=1736 lang=javascript
 * @lcpr version=30204
 *
 * [1736] 替换隐藏数字得到的最晚时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} time
 * @return {string}
 */
var maximumTime = function (time) {
  /** @type {string} 结果 */
  let ans = '';

  for (let i = 0; i < time.length; i++) {
    let cur = time[i];
    if (cur === '?') {
      if (ans.length === 0) {
        // 此时, 需要根据下一位来判断当前位
        if (time[i + 1] === '?' || Number(time[i + 1]) < 4) {
          ans += '2';
        } else {
          ans += '1';
        }
      } else if (ans.length === 1) {
        if (ans[0] === '2') {
          ans += '3';
        } else {
          ans += '9';
        }
      } else if (ans.length === 3) {
        ans += '5';
      } else if (ans.length === 4) {
        ans += '9';
      }
    } else {
      ans += cur;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "2?:?0"\n
// @lcpr case=end

// @lcpr case=start
// "0?:3?"\n
// @lcpr case=end

// @lcpr case=start
// "1?:22"\n
// @lcpr case=end

 */

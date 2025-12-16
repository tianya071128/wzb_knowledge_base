/*
 * @lc app=leetcode.cn id=1208 lang=javascript
 * @lcpr version=30204
 *
 * [1208] 尽可能使字符串相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @param {number} maxCost
 * @return {number}
 */
var equalSubstring = function (s, t, maxCost) {
  // 将字符之间的要变换的次数记录一下
  let arr = [];
  for (let i = 0; i < s.length; i++) {
    arr.push(Math.abs(s[i].charCodeAt() - t[i].charCodeAt()));
  }

  // 滑动窗口
  let l = 0,
    r = 0,
    sum = arr[0], // 窗口大小
    ans = 0; // 长度
  while (r < arr.length) {
    // 是否移动右指针 --> 窗口可以继续向右延伸
    while (r < arr.length - 1 && maxCost >= sum + arr[r + 1]) {
      r++;
      sum += arr[r];
    }

    // 是否移动左指针 --> 窗口过大, 收缩窗口
    while (l <= r && sum > maxCost) {
      sum -= arr[l];
      l++;
    }

    ans = Math.max(ans, r - l + 1);

    r++;
    sum += arr[r];
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=equalSubstring
// paramTypes= ["string","string","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abcd"\n"bcdf"\n3\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n"cdef"\n3\n
// @lcpr case=end

// @lcpr case=start
// "abcdefg"\n"abdeefg"\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = equalSubstring;
// @lcpr-after-debug-end

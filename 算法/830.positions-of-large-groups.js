/*
 * @lc app=leetcode.cn id=830 lang=javascript
 * @lcpr version=30204
 *
 * [830] 较大分组的位置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number[][]}
 */
var largeGroupPositions = function (s) {
  let left = 0,
    ans = [];
  for (let i = 0; i < s.length; i++) {
    // 如果不一致, 那么说明不是一个组
    if (s[i] !== s[i + 1]) {
      if (i - left + 1 >= 3) {
        ans.push([left, i]);
      }

      left = i + 1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abbxxxxzzy"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n
// @lcpr case=end

// @lcpr case=start
// "abcdddeeeeaabbbcd"\n
// @lcpr case=end

// @lcpr case=start
// "aba"\n
// @lcpr case=end

 */

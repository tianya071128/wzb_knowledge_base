/*
 * @lc app=leetcode.cn id=1370 lang=javascript
 * @lcpr version=30204
 *
 * [1370] 上升下降字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var sortString = function (s) {
  // 1. 记录字符的数量
  let hash = new Map();
  for (const item of s) {
    hash.set(item, (hash.get(item) ?? 0) + 1);
  }

  // 2. 排序字符 --> 按算法取字符
  let list = [...hash].sort((a, b) => a[0].charCodeAt() - b[0].charCodeAt()),
    ans = '',
    i = 0,
    direction = 1;

  while (s.length !== ans.length) {
    if (list[i][1]) {
      ans += list[i][0];
      list[i][1]--;
    }

    if (direction === 1) {
      if (i === list.length - 1) {
        direction = -1;
      } else {
        i++;
      }
    } else {
      if (i === 0) {
        direction = 1;
      } else {
        i--;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=sortString
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "aaaabbbbcccc"\n
// @lcpr case=end

// @lcpr case=start
// "rat"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = sortString;
// @lcpr-after-debug-end

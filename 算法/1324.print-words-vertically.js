/*
 * @lc app=leetcode.cn id=1324 lang=javascript
 * @lcpr version=30204
 *
 * [1324] 竖直打印单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string[]}
 */
var printVertically = function (s) {
  let maxLen = 0,
    list = s.split(' '),
    ans = [];

  /** 尾部遍历 */
  for (let i = list.length - 1; i >= 0; i--) {
    let item = list[i];
    // 确定遍历长度
    maxLen = Math.max(maxLen, item.length);
    for (let i = 0; i < maxLen; i++) {
      ans[i] = (item[i] ?? ' ') + (ans[i] ?? '');
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "HOW ARE YOU"\n
// @lcpr case=end

// @lcpr case=start
// "TO BE OR NOT TO BE"\n
// @lcpr case=end

// @lcpr case=start
// "CONTEST IS COMING"\n
// @lcpr case=end

 */

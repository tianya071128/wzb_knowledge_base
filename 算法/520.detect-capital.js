/*
 * @lc app=leetcode.cn id=520 lang=javascript
 * @lcpr version=30204
 *
 * [520] 检测大写字母
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function (word) {
  /**
   * 确定之后的检测方向:
   *  null 未确定 | false 小写 | true 大写
   */
  let check = null;

  for (let i = 0; i < word.length; i++) {
    const item = word[i].charCodeAt() >= 65 && word[i].charCodeAt() <= 90;

    /** 如果是首字母 */
    if (i === 0) {
      // 如果是小写, 那么就确定了方向
      if (!item) check = item;
    } else if (i === 1 && check === null) {
    /** 第二个字母并且没有确定方向, 首字母为大写时, 还要确定第二个 */
      check = item;
    } else {
    /** 其他情况, 检测 */
      if (item !== check) return false;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "USA"\n
// @lcpr case=end

// @lcpr case=start
// "FlaG"\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=925 lang=javascript
 * @lcpr version=30204
 *
 * [925] 长按键入
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} name
 * @param {string} typed
 * @return {boolean}
 */
var isLongPressedName = function (name, typed) {
  let p = 0;

  // 遍历 name, 在 typed 中找到的字符
  for (const s of name) {
    // 此时为重复字符, 可以去除
    while (p < typed.length && typed[p] !== s && typed[p] === typed[p - 1]) {
      p++;
    }

    if (typed[p] !== s) return false;
    p++;
  }

  // 如果 typed 还有字符多, 则必须等于 name 最后一个字符
  for (; p < typed.length; p++) {
    if (typed[p] !== typed[p - 1]) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "alex"\n"alexxx"\n
// @lcpr case=end

// @lcpr case=start
// "saeed"\n"ssaaedd"\n
// @lcpr case=end

 */

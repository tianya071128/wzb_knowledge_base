/*
 * @lc app=leetcode.cn id=744 lang=javascript
 * @lcpr version=30204
 *
 * [744] 寻找比目标字母大的最小字母
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[]} letters
 * @param {character} target
 * @return {character}
 */
var nextGreatestLetter = function (letters, target) {
  /**
   * 二分搜索
   */
  let left = 0,
    right = letters.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);

    // 在左区间
    if (letters[mid] > target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return letters[left] > target ? letters[left] : letters[0];
};
// @lc code=end

/*
// @lcpr case=start
// ["c", "f", "j"]\n"a"\n
// @lcpr case=end

// @lcpr case=start
// ["c","f","j"]\n"c"\n
// @lcpr case=end

// @lcpr case=start
// ["x","x","y","y"]\n"z"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = nextGreatestLetter;
// @lcpr-after-debug-end

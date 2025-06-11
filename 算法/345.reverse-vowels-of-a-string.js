/*
 * @lc app=leetcode.cn id=345 lang=javascript
 * @lcpr version=30204
 *
 * [345] 反转字符串中的元音字母
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function (s) {
  /**
   * 双指针
   */
  let list = s.split(''),
    map = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']),
    left = 0,
    right = list.length - 1;

  while (left < right) {
    if (!map.has(list[left])) {
      left++;
    } else if (!map.has(list[right])) {
      right--;
    } else {
      [list[left], list[right]] = [list[right], list[left]];
      left++;
      right--;
    }
  }

  return list.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "IceCreAm"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

 */

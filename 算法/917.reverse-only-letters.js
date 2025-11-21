/*
 * @lc app=leetcode.cn id=917 lang=javascript
 * @lcpr version=30204
 *
 * [917] 仅仅反转字母
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseOnlyLetters = function (s) {
  /**
   * 转换为数组, 之后双指针处理
   */
  let arr = s.split(''),
    left = 0,
    right = arr.length - 1;

  while (left < right) {
    // 左指针到字母
    while (left < right && !/[a-zA-Z]/.test(arr[left])) {
      left++;
    }
    // 右指针到字母
    while (left < right && !/[a-zA-Z]/.test(arr[right])) {
      right--;
    }

    if (left < right) [arr[left], arr[right]] = [arr[right], arr[left]];

    left++;
    right--;
  }

  return arr.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "ab-cd"\n
// @lcpr case=end

// @lcpr case=start
// "a-bC-dEf-ghIj"\n
// @lcpr case=end

// @lcpr case=start
// "code-Q!"\n
// @lcpr case=end

 */

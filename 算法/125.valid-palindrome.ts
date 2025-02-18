/*
 * @lc app=leetcode.cn id=125 lang=typescript
 * @lcpr version=30204
 *
 * [125] 验证回文串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function isPalindrome(s: string): boolean {
  /**
   * 双指针
   */
  let left = 0,
    right = s.length - 1,
    isLegal = (s: string) => /[a-zA-Z0-9]/.test(s);

  while (right > left) {
    // 如果碰到了非字母和数字的话, 左右指针相继移动
    while (s[left] != undefined && !isLegal(s[left])) {
      left++;
    }

    while (s[right] != undefined && !isLegal(s[right])) {
      right--;
    }

    if (
      s[left] &&
      s[right] &&
      s[left].toLocaleLowerCase() !== s[right].toLocaleLowerCase()
    )
      return false;

    left++;
    right--;
  }

  return true;
}
// @lc code=end

/*
// @lcpr case=start
// "A man, a plan, a canal: Panama"\n
// @lcpr case=end

// @lcpr case=start
// "race a car"\n
// @lcpr case=end

// @lcpr case=start
// " "\n
// @lcpr case=end

 */

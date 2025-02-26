/*
 * @lc app=leetcode.cn id=151 lang=typescript
 * @lcpr version=30204
 *
 * [151] 反转字符串中的单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function reverseWords(s: string): string {
  // 直接使用 API
  // return s
  //   .split(' ')
  //   .filter((item) => !!item)
  //   .reverse()
  //   .join(' ');

  // 双指针, 使用 O(1) 空间
  let start = s.length - 1,
    end = s.length - 1,
    res = '';
  while (start >= 0) {
    // 先查找 end 指针位置, 第一个非空格
    while (s[end] === ' ') {
      end--;
    }
    // 在查找 start 指针位置, 当上一项为空格
    start = end;
    while (s[start - 1] !== ' ' && start >= 1) {
      start--;
    }

    if (start >= 0) {
      res += (res !== '' ? ' ' : '') + s.slice(start, end + 1);
    }

    start = end = start - 1;
  }

  return res;
}
// @lc code=end

/*
// @lcpr case=start
// "the sky is blue"\n
// @lcpr case=end

// @lcpr case=start
// "  hello world  "\n
// @lcpr case=end

// @lcpr case=start
// "a good   example"\n
// @lcpr case=end

 */

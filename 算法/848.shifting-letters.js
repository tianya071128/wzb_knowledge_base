/*
 * @lc app=leetcode.cn id=848 lang=javascript
 * @lcpr version=30204
 *
 * [848] 字母移位
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number[]} shifts
 * @return {string}
 */
var shiftingLetters = function (s, shifts) {
  /**
   * 1. 前缀和得出每个位置需要移动的次数
   * 2. 根据移动的次数来定位最终的字符
   */
  let letter = 'abcdefghijklmnopqrstuvwxyz',
    ans = '', // 结果
    iMap = new Map(letter.split('').map((item, index) => [item, index])), // 字符对应的索引
    prefixSum = [shifts[0]]; // 前缀和

  // 计算前缀和
  for (let i = 1; i < shifts.length; i++) {
    prefixSum.push(prefixSum.at(-1) + shifts[i]);
  }

  // 计算每个字符
  for (let i = 0; i < s.length; i++) {
    let strIndex =
      // 该字符原本的索引
      (iMap.get(s[i]) +
        // 最终需要变换的次数
        prefixSum.at(-1) -
        (prefixSum[i - 1] ?? 0)) %
      26;
    ans += letter[strIndex];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "bad"\n[10,20,30]\n
// @lcpr case=end

// @lcpr case=start
// "aaa"\n[1,2,3]\n
// @lcpr case=end

 */

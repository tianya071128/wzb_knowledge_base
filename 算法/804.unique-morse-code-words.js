/*
 * @lc app=leetcode.cn id=804 lang=javascript
 * @lcpr version=30204
 *
 * [804] 唯一摩尔斯密码词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {number}
 */
var uniqueMorseRepresentations = function (words) {
  let ans = new Set(),
    map = [
      '.-',
      '-...',
      '-.-.',
      '-..',
      '.',
      '..-.',
      '--.',
      '....',
      '..',
      '.---',
      '-.-',
      '.-..',
      '--',
      '-.',
      '---',
      '.--.',
      '--.-',
      '.-.',
      '...',
      '-',
      '..-',
      '...-',
      '.--',
      '-..-',
      '-.--',
      '--..',
    ];

  for (const word of words) {
    let str = '';
    for (const s of word) {
      str += map[s.charCodeAt() - 97];
    }

    ans.add(str);
  }

  return ans.size;
};
// @lc code=end

/*
// @lcpr case=start
// ["gin", "zen", "gig", "msg"]\n
// @lcpr case=end

// @lcpr case=start
// ["a"]\n
// @lcpr case=end

 */

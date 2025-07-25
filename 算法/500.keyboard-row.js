/*
 * @lc app=leetcode.cn id=500 lang=javascript
 * @lcpr version=30204
 *
 * [500] 键盘行
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 *
 * 后续优化:
 *  - 不适用 Map 做哈希处理, 占用空间大
 *  - 直接使用字符串 "12210111011122000010020202" --> 计算字符的码值获取对应的行数
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function (words) {
  /**
   * 使用哈希表存储一行的字母
   */
  let hash = new Map([
      ['q', 0],
      ['w', 0],
      ['e', 0],
      ['r', 0],
      ['t', 0],
      ['y', 0],
      ['u', 0],
      ['i', 0],
      ['o', 0],
      ['p', 0],
      ['a', 1],
      ['s', 1],
      ['d', 1],
      ['f', 1],
      ['g', 1],
      ['h', 1],
      ['j', 1],
      ['k', 1],
      ['l', 1],
      ['z', 2],
      ['x', 2],
      ['c', 2],
      ['v', 2],
      ['b', 2],
      ['n', 2],
      ['m', 2],
    ]),
    ans = [];

  one: for (const word of words) {
    let line;

    for (const s of word.toLocaleLowerCase()) {
      if (line == undefined) {
        line = hash.get(s);
      } else if (line !== hash.get(s)) {
        continue one;
      }
    }

    ans.push(word);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["Hello","Alaska","Dad","Peace"]\n
// @lcpr case=end

// @lcpr case=start
// ["omk"]\n
// @lcpr case=end

// @lcpr case=start
// ["adsdf","sfd"]\n
// @lcpr case=end

 */

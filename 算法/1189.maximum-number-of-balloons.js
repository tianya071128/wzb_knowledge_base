/*
 * @lc app=leetcode.cn id=1189 lang=javascript
 * @lcpr version=30204
 *
 * [1189] “气球” 的最大数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @return {number}
 */
var maxNumberOfBalloons = function (text) {
  let hash = new Map([
    ['b', 0],
    ['a', 0],
    ['l', 0],
    ['o', 0],
    ['n', 0],
  ]);

  for (const s of text) {
    if (hash.has(s)) {
      hash.set(s, hash.get(s) + 1);
    }
  }

  // l 和 o 需要 /2
  hash.set('l', Math.floor(hash.get('l') / 2));
  hash.set('o', Math.floor(hash.get('o') / 2));

  return Math.min(...hash.values());
};
// @lc code=end

/*
// @lcpr case=start
// "nlaebolko"\n
// @lcpr case=end

// @lcpr case=start
// "loonbalxballpoon"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

 */

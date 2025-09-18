/*
 * @lc app=leetcode.cn id=893 lang=javascript
 * @lcpr version=30204
 *
 * [893] 特殊等价字符串组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {number}
 */
var numSpecialEquivGroups = function (words) {
  /**
   * 根据题意可知: 当偶数以及奇数的字符数量都一致时, 这两个字符就是 特殊等价 的
   *
   *  --> 所以计算一下偶数和奇数的字符数量并得出一个key, 得出最大值
   */
  let hash = new Map();

  for (const word of words) {
    // 计算字符 --> 偶数和奇数放在一起, 偶数需要增加索引26
    const n = new Array(26 * 2).fill(0);
    for (let i = 0; i < word.length; i++) {
      n[word[i].charCodeAt() - 'a'.charCodeAt() + (i % 2 === 0 ? 0 : 26)]++;
    }

    let key = n.join(),
      len = (hash.get(key) ?? 0) + 1;

    hash.set(key, len);
  }

  return hash.size;
};
// @lc code=end

/*
// @lcpr case=start
// ["abcd","cdab","cbad","xyzz","zzxy","zzyx"]\n
// @lcpr case=end

// @lcpr case=start
// ["abc","acb","bac","bca","cab","cba"]\n
// @lcpr case=end

 */

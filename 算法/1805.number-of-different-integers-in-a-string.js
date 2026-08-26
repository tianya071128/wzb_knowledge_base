/*
 * @lc app=leetcode.cn id=1805 lang=javascript
 * @lcpr version=30204
 *
 * [1805] 字符串中不同整数的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word
 * @return {number}
 */
var numDifferentIntegers = function (word) {
  /** @type {number} 哈希存储 */
  let hash = new Set(),
    /** @type {number} 之前的数 */
    prevSum = '';

  for (let i = 0; i < word.length; i++) {
    if (/\d/.test(word[i])) {
      prevSum = prevSum === '0' ? word[i] : prevSum + word[i];

      if (!/\d/.test(word[i + 1])) {
        hash.add(prevSum);
        prevSum = '';
      }
    }
  }

  return hash.size;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numDifferentIntegers
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "2393706880236110407059624696967828762752651982730115221690437821508229419410771541532394006597463715513741725852432559057224478815116557380260390432211227579663571046845842281704281749571110076974264971989893607137140456254346955633455446057823738757323149856858154529105301197388177242583658641529908583934918768953462557716z97438020429952944646288084173334701047574188936201324845149110176716130267041674438237608038734431519439828191344238609567530399189316846359766256507371240530620697102864238792350289978450509162697068948604722646739174590530336510475061521094503850598453536706982695212493902968251702853203929616930291257062173c79487281900662343830648295410"\n
// @lcpr case=end

// @lcpr case=start
// "leet1234code234"\n
// @lcpr case=end

// @lcpr case=start
// "a1b01c001"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numDifferentIntegers;
// @lcpr-after-debug-end

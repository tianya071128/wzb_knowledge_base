/*
 * @lc app=leetcode.cn id=1410 lang=javascript
 * @lcpr version=30204
 *
 * [1410] HTML 实体解析器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @return {string}
 */
var entityParser = function (text) {
  let ans = '',
    hash = new Map([
      ['&quot;', '"'],
      ['&apos;', "'"],
      ['&amp;', '&'],
      ['&gt;', '>'],
      ['&lt;', '<'],
      ['&frasl;', '/'],
    ]);
  return text.replace(/\&[^\&\;]{2,5}\;/g, (val) => {
    return hash.get(val) ?? val;
  });
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=entityParser
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "& is an HTML entity but &ambassador; is not."\n
// @lcpr case=end

// @lcpr case=start
// "leetcode.com&frasl;problemset&frasl;all"\n
// @lcpr case=end

// @lcpr case=start
// "Stay home! Practice on Leetcode :)"\n
// @lcpr case=end

// @lcpr case=start
// "x > y && x < y is always false"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode.com⁄problemset⁄all"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = entityParser;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=1061 lang=javascript
 * @lcpr version=30204
 *
 * [1061] 按字典序排列最小的等效字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} baseStr
 * @return {string}
 */
var smallestEquivalentString = function (s1, s2, baseStr) {
  /**
   * 将每个字母进行分组
   */
  let shine = Array(26).fill(-1),
    group = [],
    ans = '';

  // 遍历 s1 和 s2, 对每个字符做一个最小字典序的替换
  for (let i = 0; i < s1.length; i++) {
    // 最小字典序索引
    let i1 = s1[i].charCodeAt() - 'a'.charCodeAt(),
      i2 = s2[i].charCodeAt() - 'a'.charCodeAt(),
      ansIndex = shine[i1] > shine[i2] ? i2 : i1;

    shine[i1] = shine[i2] = shine[ansIndex];
  }

  // 找到每个字符对应的最小字母
  for (const s of baseStr) {
    ans += shine[s.charCodeAt() - 'a'.charCodeAt()];
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=smallestEquivalentString
// paramTypes= ["string","string","string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "parker"\n"morris"\n"parser"\n
// @lcpr case=end

// @lcpr case=start
// "hello"\n"world"\n"hold"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n"programs"\n"sourcecode"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = smallestEquivalentString;
// @lcpr-after-debug-end

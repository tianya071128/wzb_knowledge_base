/*
 * @lc app=leetcode.cn id=205 lang=javascript
 * @lcpr version=30204
 *
 * [205] 同构字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function (s, t) {
  /**
   * 描述描述的不是很好, 简单来讲:
   *
   *  字符只能同位置替换, 并且同一个字符只能固定替换一个字符
   *
   *    e.g:
   *      egg
   *      |||
   *      |||
   *      |||
   *      add
   */
  // 双向都要同一映射
  const cache = {};
  const reverseCache = {};

  for (let i = 0; i < s.length; i++) {
    const sub1 = s[i];
    const sub2 = t[i];

    if (
      (cache[sub1] && cache[sub1] !== sub2) ||
      (reverseCache[sub2] && reverseCache[sub2] !== sub1)
    )
      return false;

    cache[sub1] = sub2;
    reverseCache[sub2] = sub1;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "badc"\n"baba"\n
// @lcpr case=end

// @lcpr case=start
// "foo"\n"bar"\n
// @lcpr case=end

// @lcpr case=start
// "paper"\n"title"\n
// @lcpr case=end

 */

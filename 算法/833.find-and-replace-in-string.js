/*
 * @lc app=leetcode.cn id=833 lang=javascript
 * @lcpr version=30204
 *
 * [833] 字符串中的查找与替换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number[]} indices
 * @param {string[]} sources
 * @param {string[]} targets
 * @return {string}
 */
var findReplaceString = function (s, indices, sources, targets) {
  /**
   * 1. 对 indices 进行降序排序
   * 2. 对字符 s 从右往左操作, 这样的话, 即使对 s 替换, 之前的索引也不会变化
   */
  let list = indices.map((item, i) => [item, sources[i], targets[i]]),
    ans = s;
  list.sort((a, b) => b[0] - a[0]);

  for (const [indice, source, target] of list) {
    let i = s.indexOf(source, indice);

    // 满足条件, 执行替换
    if (i === indice) {
      ans = `${ans.slice(0, indice)}${target}${ans.slice(
        indice + source.length
      )}`;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abcdef"\n[2,2]\n["cdef","feg"]\n["feg","abc"]\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n[0,2]\n["ab","ec"]\n["eee","ffff"]\n
// @lcpr case=end

 */

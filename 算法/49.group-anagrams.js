/*
 * @lc app=leetcode.cn id=49 lang=javascript
 * @lcpr version=30204
 *
 * [49] 字母异位词分组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  const hash = {};

  for (const str of strs) {
    // 对每个字符进行排序后重组
    const sortStr = str.split('').sort().join('');

    if (hash[sortStr]) {
      hash[sortStr].push(str);
    } else {
      hash[sortStr] = [str];
    }
  }

  return Object.values(hash);
};
// @lc code=end

/*
// @lcpr case=start
// ["eat", "tea", "tan", "ate", "nat", "bat"]\n
// @lcpr case=end

// @lcpr case=start
// [""]\n
// @lcpr case=end

// @lcpr case=start
// ["a"]\n
// @lcpr case=end

 */

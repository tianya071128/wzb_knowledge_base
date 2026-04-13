/*
 * @lc app=leetcode.cn id=140 lang=javascript
 * @lcpr version=30204
 *
 * [140] 单词拆分 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function (s, wordDict) {
  /**
   * 字典树
   */
  let dictTree = new Map();
  for (const dictItem of wordDict) {
    let curDict = dictTree;
    for (const item of dictItem) {
      // 增加下级
      if (!curDict.has(item)) curDict.set(item, new Map());

      curDict = curDict.get(item);
    }

    // 增加结束标识
    curDict.set('#', true);
  }

  // 回溯
  let ans = [],
    paths = [];

  function dfs(i) {
    // 到达终点
    if (i >= s.length) {
      ans.push(paths.join(' '));
      return;
    }

    // 从当前 i 开始往后查找
    let str = '',
      curDict = dictTree;
    while (curDict && i < s.length) {
      str += s[i];
      curDict = curDict.get(s[i]);
      i++;

      // 当前字符在字典树中并且是一个终点
      if (curDict && curDict.has('#')) {
        paths.push(str);
        dfs(i);
        paths.pop();
      }
    }
  }

  dfs(0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "aaaaaaaaaaaaaaaaa"\n["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]\n
// @lcpr case=end

// @lcpr case=start
// "pineapplepenapple"\n["apple","pen","applepen","pine","pineapple"]\n
// @lcpr case=end

// @lcpr case=start
// "catsandog"\n["cats","dog","sand","and","cat"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = wordBreak;
// @lcpr-after-debug-end

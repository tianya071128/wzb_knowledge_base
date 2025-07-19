/*
 * @lc app=leetcode.cn id=720 lang=javascript
 * @lcpr version=30204
 *
 * [720] 词典中最长的单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {string}
 */
var longestWord = function (words) {
  /**
   * 1. 先对所有的字符串使用 map 存储字符串前缀(除去最后一个元素的)
   * 2. 从 "" 开始, 尝试组合
   */
  let ans = '',
    map = new Map();

  // 使用 map 存储
  for (const s of words) {
    const prefix = s.slice(0, -1);
    map.set(prefix, [...(map.get(prefix) ?? []), s]);
  }

  function dfs(prefix) {
    // 找到前缀对应的数组
    const list = map.get(prefix) ?? [];

    for (const item of list) {
      // 更新结果
      ans =
        item.length > ans.length || (item.length === ans.length && item < ans)
          ? item
          : ans;
      dfs(item);
    }
  }

  dfs('');

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["m","mo","moc","moch","mocha","l","la","lat","latt","latte","c","ca","cat"]\n
// @lcpr case=end

// @lcpr case=start
// ["a", "banana", "app", "appl", "ap", "apply", "apple"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = longestWord;
// @lcpr-after-debug-end

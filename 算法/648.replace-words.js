/*
 * @lc app=leetcode.cn id=648 lang=javascript
 * @lcpr version=30204
 *
 * [648] 单词替换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化思路: 构建字典树时, 可以使用特殊符号 # 来表示是否为词根结尾
 *
 * @param {string[]} dictionary
 * @param {string} sentence
 * @return {string}
 */
var replaceWords = function (dictionary, sentence) {
  // 1. 将 dictionary 转化为 208.实现 Trie (前缀树)
  // 2. 在前缀树中检索 sentence

  const trie = new Map();
  for (const str of dictionary) {
    let prevTrie = trie;
    for (let i = 0; i < str.length; i++) {
      const s = str[i];
      let trieItem = prevTrie.get(s);

      // 没有不存在, 则创建新的
      if (!trieItem)
        trieItem = {
          str: '', // 词根
          isEnd: false,
          trie: new Map(),
        };

      // 判断是否为终点
      if (i === str.length - 1) {
        trieItem.isEnd = true;
        trieItem.str = str;
      }

      prevTrie.set(s, trieItem);
      prevTrie = trieItem.trie;
    }
  }

  let ans = [];
  for (const str of sentence.split(' ')) {
    // 在前缀树中检索
    let prevTrie = trie,
      matchTrieItem; // 匹配的词根
    for (const s of str) {
      const trieItem = prevTrie.get(s);

      // 不存在词根匹配, 则直接返回原值
      if (!trieItem) break;

      if (trieItem.isEnd) {
        matchTrieItem = trieItem;
        break;
      }

      prevTrie = trieItem.trie;
    }

    // 匹配到了
    ans.push(matchTrieItem ? matchTrieItem.str : str);
  }

  return ans.join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// ["cat","cata","cad","bat","rat"]\n"the cattle was rattled by the battery"\n
// @lcpr case=end

// @lcpr case=start
// ["a","b","c"]\n"aadsfasf absbs bbab cadsfafs"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = replaceWords;
// @lcpr-after-debug-end

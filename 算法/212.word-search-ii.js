/*
 * @lc app=leetcode.cn id=212 lang=javascript
 * @lcpr version=30204
 *
 * [212] 单词搜索 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function (board, words) {
  // 字典树
  let trie = new Map();
  for (const word of words) {
    let next = trie;
    for (const s of word) {
      if (!next.has(s)) next.set(s, new Map());

      next = next.get(s);
    }

    next.set('#', true);
  }

  // 回溯
  let m = board.length,
    n = board[0].length,
    ans = new Set(),
    direction = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ],
    mark = new Array(m).fill(0).map((item) => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dfs(i, j, trie, '');
    }
  }

  function dfs(i, j, trie, word) {
    // 剪枝, 超出边界
    if (i < 0 || i >= m || j < 0 || j >= n || mark[i][j]) return;

    let s = board[i][j];
    trie = trie.get(s);
    word = word + s;

    // 剪枝: 当前字符在字典树中无法找到
    if (!trie) return;

    // 找到单词
    if (trie.has('#')) {
      ans.add(word);
    }

    mark[i][j] = 1;

    // 继续相邻的
    for (const [diffX, diffY] of direction) {
      dfs(i + diffX, j + diffY, trie, word);
    }

    mark[i][j] = 0;
  }

  return [...ans];
};

// @lc code=end

/*
// @lcpr case=start
// [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","e","a","t"]]\n["oath","pea","eat","rain"]\n
// @lcpr case=end

// @lcpr case=start
// [["a","b"],["c","d"]]\n["abcb"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findWords;
// @lcpr-after-debug-end

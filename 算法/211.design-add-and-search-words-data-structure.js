/*
 * @lc app=leetcode.cn id=211 lang=javascript
 * @lcpr version=30204
 *
 * [211] 添加与搜索单词 - 数据结构设计
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var WordDictionary = function () {
  /** Map<小写字母 | 'end', new Map()> */
  this.root = new Map();
};

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  let root = this.root;
  for (let i = 0; i < word.length; i++) {
    const s = word[i];

    // 不存在这个路径的话, 则创建一个
    !root.has(s) && root.set(s, new Map());

    root = root.get(s);

    // 如果是终点, 标记一下
    if (i === word.length - 1) {
      root.set('end', true);
    }
  }
};

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  let flag = false;
  function dfs(word, root) {
    // 终止条件
    // 1. 当不存在路径, 直接返回
    if (!root) return;
    // 2. 当 word 为 '',
    if (word === '') {
      //  root 为终点时
      if (root.has('end')) {
        flag = true;
      }

      return;
    }

    const s = word[0];
    const surplus = word.slice(1);
    if (s === '.') {
      // 遍历存在的路径
      for (const [k, item] of root) {
        if (k === 'end') continue;
        // 已经找到, 终止
        if (flag) return;

        dfs(surplus, item);
      }
    } else {
      dfs(surplus, root.get(s));
    }
  }
  dfs(word, this.root);

  return flag;
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
// @lc code=end

/*
// @lcpr case=start
// ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]\n
// @lcpr case=end

 */

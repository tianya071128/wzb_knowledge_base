/*
 * @lc app=leetcode.cn id=208 lang=typescript
 * @lcpr version=30204
 *
 * [208] 实现 Trie (前缀树)
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Trie {
  list = new Set<string>();

  insert(word: string): void {
    this.list.add(word);
  }

  search(word: string): boolean {
    return this.list.has(word);
  }

  startsWith(prefix: string): boolean {
    return [...this.list].some((item) => item.startsWith(prefix));
  }
}

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
// @lc code=end

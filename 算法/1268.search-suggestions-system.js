/*
 * @lc app=leetcode.cn id=1268 lang=javascript
 * @lcpr version=30204
 *
 * [1268] 搜索推荐系统
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} products
 * @param {string} searchWord
 * @return {string[][]}
 */
var suggestedProducts = function (products, searchWord) {
  /**
   * 字典树
   */
  // 先执行排序
  products.sort();

  let ans = [],
    tree = new Tree();

  // 组装字典树
  for (let i = 0; i < products.length; i++) {
    let curTree = tree;
    for (const s of products[i]) {
      let nextTree = curTree.children.get(s) ?? new Tree();

      // 不存在的话, 则执行添加
      if (!curTree.children.has(s)) {
        curTree.children.set(s, nextTree);
      }

      // 添加该字符索引
      nextTree.strs.length < 3 && nextTree.strs.push(i);

      curTree = nextTree;
    }
  }

  for (const s of searchWord) {
    tree = tree?.children.get(s);

    ans.push(tree?.strs.map((item) => products[item]) ?? []);
  }

  return ans;
};

class Tree {
  /** @type {number[]} 索引集合 */
  strs = [];
  /** @type {Map<string, Tree>} 子级 */
  children = new Map();
}
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=suggestedProducts
// paramTypes= ["string[]","string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["mobile","mouse","moneypot","monitor","mousepad"]\n"mouse"\n
// @lcpr case=end

// @lcpr case=start
// ["havana"]\n"havana"\n
// @lcpr case=end

// @lcpr case=start
// ["bags","baggage","banner","box","cloths"]\n"bags"\n
// @lcpr case=end

// @lcpr case=start
// ["havana"]\n"tatiana"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = suggestedProducts;
// @lcpr-after-debug-end

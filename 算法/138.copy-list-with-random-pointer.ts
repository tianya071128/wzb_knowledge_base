/*
 * @lc app=leetcode.cn id=138 lang=typescript
 * @lcpr version=30204
 *
 * [138] 随机链表的复制
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for _Node.
 * class _Node {
 *     val: number
 *     next: _Node | null
 *     random: _Node | null
 *
 *     constructor(val?: number, next?: _Node, random?: _Node) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *         this.random = (random===undefined ? null : random)
 *     }
 * }
 */
function copyRandomList(head: _Node | null): _Node | null {
  /**
   * 在复制节点的过程中缓存已复制的节点, 在执行 next、random 的链接
   */
  const cache = new Map<_Node, _Node>();

  // 复制节点
  function copyNode(node: _Node | null) {
    if (!node) return node;

    if (cache.get(node)) return cache.get(node) ?? null;

    // 先将构建的值缓存
    const _node = new _Node(node.val);
    cache.set(node, _node);

    _node.next = copyNode(node.next);
    _node.random = copyNode(node.random);

    return _node;
  }

  return copyNode(head);
}

// @lc code=end

/*
// @lcpr case=start
// [[7,null],[13,0],[11,4],[10,2],[1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1],[2,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[3,null],[3,0],[3,null]]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=146 lang=typescript
 * @lcpr version=30204
 *
 * [146] LRU 缓存
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

class CurListNode {
  val: number;
  key: number;
  next: CurListNode;
  prev: CurListNode;
  constructor(val: number, key: number, next: CurListNode, prev: CurListNode) {
    this.val = val === undefined ? 0 : val;
    this.next = next;
    this.prev = prev;
    this.key = key;
  }
}

/**
 * 使用双向链表实现:
 *  1. 使用哈希表记录下关键字对应的节点，用这个来解决链表的快速查询，为 O(1)，符合题意
 *  2. 当操作(获取、推入、移除)时, 先将该节点插入到链表头，在进行操作
 *  3. 移除时, 根据哑结点的 prev 进行移除
 */
class LRUCache {
  // 容量
  capacity: number = 0;
  // 哑结点 - 头部节点
  // @ts-ignore: 忽略此行的参数数量不匹配错误，在下一行会赋值
  dummy = new CurListNode(0, 0);
  // 哈希表
  cache = new Map<number, CurListNode>();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.dummy.next = this.dummy;
    this.dummy.prev = this.dummy;
  }

  // 将指定节点插入到头部
  insertNodeToHead(node: CurListNode) {
    // 先断开之前的链接
    node.next.prev = node.prev;
    node.prev.next = node.next;

    // 链接新链接
    this.dummy.next.prev = node;
    node.prev = this.dummy;
    node.next = this.dummy.next;
    this.dummy.next = node;
  }

  // 移除最久未使用的关键字
  removeOldNode() {
    const node = this.dummy.prev;

    node.next.prev = node.prev;
    node.prev.next = node.next;

    this.cache.delete(node.key);
  }

  get(key: number): number {
    const node = this.cache.get(key);

    if (!node) return -1;

    this.insertNodeToHead(node);
    return node.val;
  }

  put(key: number, value: number): void {
    const node = this.cache.get(key);

    if (node) {
      this.insertNodeToHead(node);
      node.val = value;
    } else {
      if (this.capacity === this.cache.size && this.cache.size >= 1) {
        // 移除最久未使用的关键字
        this.removeOldNode();
      }

      // 添加节点
      const newNode = new CurListNode(value, key, this.dummy.next, this.dummy);
      this.cache.set(key, newNode);

      // 添加至头部
      this.insertNodeToHead(newNode);
    }
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end

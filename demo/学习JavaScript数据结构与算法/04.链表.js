// 链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。
// 每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也称指针或链接）组成。
// 链表相比数组最重要的优点，那就是无需移动链表中的元素，就能轻松地添加和移除元素

/**
 *                 节点           节点           节点         null
 *
 * head  -->  item  next -->  item  next -->  item  next -->  null
 *
 */

// #region ------------ 模拟链表 ------------
// 节点类
class Node {
  constructor(element) {
    /** 节点元素 */
    this.element = element;
    /** 该节点指向下一个元素的引用 */
    this.next = null;
  }
}

class LinkedList {
  /** 链表长度 */
  #length = 0;

  /** 链表第一个节点的引用 */
  #head = null;

  /** 向列表尾部添加一个新的项。 */
  append(element) {
    this.insert(this.#length, element);
  }

  /** 向列表的特定位置插入一个新的项 */
  insert(position, element) {
    position = Number(position);
    // 如果插入位置超出链表边界
    if (position < 0 || position > this.#length) return false;

    let node = new Node(element),
      current = this.#head,
      previous;

    // 如果要插入为开头的话
    if (position === 0) {
      // 重置开头引用
      this.#head = node;
    } else {
      for (let index = 0; index < position; index++) {
        previous = current;
        current = current.next;
      }
      previous.next = node;
    }

    // 建立连接
    node.next = current;
    this.#length++;
    // 表示插入成功
    return true;
  }

  /** 从列表中移除一项 */
  remove(element) {
    this.removeAt(this.indexOf(element));
  }

  /** 返回元素在列表中的索引。如果列表中没有该元素则返回 -1 */
  indexOf(element) {
    let current = this.#head,
      index = 0;
    while (current) {
      if (element === current.element) return index;

      index++;
      current = current.next;
    }
    return -1;
  }

  /** 从列表的特定位置移除一项 */
  removeAt(position) {
    position = Number(position);
    // 如果移除位置超出链表边界
    if (position < 0 || position > this.#length - 1) return null;

    let current = this.#head,
      removeItem;

    // 如果是第一项, 特殊处理一下
    if (position === 0) {
      this.#head = current.next;
      removeItem = current.element;
    } else {
      // position: 2 --> 循环一次
      // position: 3 --> 循环二次
      for (let index = 1; index < position; index++) {
        current = current.next;
      }

      // 将删除的项, 从上一个链接到下一个, 跳过删除项
      // 例如: 删除 位置1, 此时 current 的是 位置0 的
      removeItem = current.next;
      current.next = current.next.next;
    }

    this.#length--;
  }

  /** 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false */
  isEmpty() {
    return this.#length === 0;
  }

  /** 返回链表包含的元素个数。与数组的length属性类似 */
  size() {
    return this.#length;
  }

  /** 由于列表项使用了 Node 类，就需要重写继承自 JavaScript 对象默认的 toString 方法，让其只输出元素的值 */
  toString() {
    let current = this.#head,
      str = '';
    while (current) {
      str += current.element;
      current = current.next;
    }
    return str;
  }

  /** 打印 */
  print() {
    let arr = [],
      current = this.#head;
    for (let index = 0; index < this.#length; index++) {
      if (current) {
        current && arr.push(current);
        current = current.next;
      }
    }

    console.log(arr);
  }
}

const linkedList = new LinkedList();
linkedList.insert(0, '1');
linkedList.insert(1, '3');
linkedList.insert(1, '2');
linkedList.print();
console.log(linkedList.indexOf('1'));
// linkedList.removeAt(1);
// linkedList.print();
// #endregion

// 普通链表：一个节点只有链向下一个节点的链接
// 双向链表：链接是双向的：一个链向下一个元素，另一个链向前一个元素
// 循环链表：和链表之间唯一的区别在于，最后一个元素指向下一个元素的指针（tail.next）不是引用null，而是指向第一个元素（head）

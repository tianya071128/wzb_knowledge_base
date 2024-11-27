// 树是一种分层数据的抽象模型，也是一种非顺序数据结构

// 二叉树：树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。
// 二叉搜索树：是二叉树的一种，但是它只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大（或者等于）的值

// #region ------------ 实现二叉搜索树 ------------
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  #root = null;

  /** 将节点加在非根节点的其他位置 */
  static insertNode(node, newNode) {
    if (newNode.key < node.key) {
      // 在左侧节点存储（比父节点）小的值
      if (node.left === null) {
        node.left = newNode;
      } else {
        // 递归
        BinarySearchTree.insertNode(node.left, newNode);
      }
    } else {
      // 在右侧节点存储（比父节点）大（或者等于）的值
      if (node.right === null) {
        node.right = newNode;
      } else {
        BinarySearchTree.insertNode(node.right, newNode);
      }
    }
  }

  /** 向树中插入一个新的键 */
  insert(key) {
    const node = new Node(key);
    if (this.#root) {
      BinarySearchTree.insertNode(this.#root, node);
    } else {
      this.#root = node;
    }
  }

  static searchNode(node, key) {
    if (node === null) return false;

    if (node.key === key) return true;

    if (node.key < key) return this.searchNode(node.right, key);

    if (node.key > key) return this.searchNode(node.left, key);
  }
  /** 在树中查找一个键，如果节点存在，则返回true；如果不存在，则返回false */
  search(key) {
    return BinarySearchTree.searchNode(this.#root, key);
  }

  static inOrderTraverseNode(node, callback) {
    if (node !== null) {
      BinarySearchTree.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      BinarySearchTree.inOrderTraverseNode(node.right, callback);
    }
  }
  /**
   * 通过中序遍历方式遍历所有节点
   *  以上行顺序访问BST所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点。
   */
  inOrderTraverse(callback) {
    BinarySearchTree.inOrderTraverseNode(this.#root, callback);
  }

  static preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key);
      BinarySearchTree.preOrderTraverseNode(node.left, callback);
      BinarySearchTree.preOrderTraverseNode(node.right, callback);
    }
  }
  /**
   * 通过先序遍历方式遍历所有节点
   *  以优先于后代节点的顺序访问每个节点的
   */
  preOrderTraverse(callback) {
    BinarySearchTree.preOrderTraverseNode(this.#root, callback);
  }

  static postOrderTraverseNode(node, callback) {
    if (node !== null) {
      BinarySearchTree.postOrderTraverseNode(node.left, callback);
      BinarySearchTree.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }
  /**
   * 通过后序遍历方式遍历所有节点
   *  先访问节点的后代节点，再访问节点本身
   */
  postOrderTraverse(callback) {
    BinarySearchTree.postOrderTraverseNode(this.#root, callback);
  }

  /** 返回树中最小的值/键 */
  min() {
    let node = this.#root;

    while (node && node.left !== null) {
      node = node.left;
    }

    return node.key ?? null;
  }

  /** 返回树中最大的值/键 */
  max() {
    let node = this.#root;

    while (node && node.right !== null) {
      node = node.right;
    }

    return node.key ?? null;
  }

  static removeNode(node, key) {
    if (node === null) {
      return null;
    }
    if (key < node.key) {
      node.left = BinarySearchTree.removeNode(node.left, key);
      return node;
    } else if (key > node.key) {
      node.right = BinarySearchTree.removeNode(node.right, key);
      return node;
    } else {
      //键等于node.key
      //第一种情况——一个叶节点
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }
      //第二种情况——一个只有一个子节点的节点
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }

      //第三种情况——一个有两个子节点的节点
      const aux = findMinNode(node.right);
      node.key = aux.key;
      node.right = BinarySearchTree.removeNode(node.right, aux.key);
      return node;
    }
  }

  /** 从树中移除某个键 */
  remove(key) {}
}

const tree = new BinarySearchTree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(20);
tree.insert(18);
tree.insert(25);

// 3 5 7 8 9 10 11 12 13 14 15 18 20 25
tree.inOrderTraverse((val) => {
  console.log(val);
});

// 11 7 5 3 9 8 10 15 13 12 14 20 18 25
tree.preOrderTraverse((val) => {
  console.log(val);
});

// 3 5 8 10 9 7 12 14 13 18 25 20 15 11
tree.postOrderTraverse((val) => {
  console.log(val);
});

console.log(tree.min()); // 3
console.log(tree.max()); // 25
console.log(tree.search(12)); // true
console.log(tree.search(300)); // false
// #endregion

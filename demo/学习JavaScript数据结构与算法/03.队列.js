// 队列是遵循FIFO（First In First Out，先进先出，也称为先来先服务）原则的一组有序的项。
// 队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

// 与 栈 同理, JS 没有内置队列的数据结构, 通过 shift 和 push 来模拟
class Queue {
  #items = [];

  /** 向队列尾部添加一个（或多个）新的项 */
  enqueue(...args) {
    return this.#items.push(...args);
  }

  /** 移除队列的第一（即排在队列最前面的）项，并返回被移除的元素。 */
  dequeue() {
    return this.#items.shift();
  }

  /** 返回队列中第一个元素——最先被添加，也将是最先被移除的元素。队列不做任何变动（不移除元素，只返回元素信息——与Stack类的peek方法非常类似）。 */
  front() {
    return this.#items[0];
  }

  /** 如果队列中不包含任何元素，返回true，否则返回false。 */
  isEmpty() {
    return !this.#items.length;
  }

  /** 返回队列包含的元素个数，与数组的length属性类似。 */
  size() {
    return this.#items.length;
  }

  /** 打印 */
  print() {
    console.log(this.#items.toString());
  }
}

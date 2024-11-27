// 栈是一种遵从后进先出（LIFO）原则的有序集合。新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端就叫栈底。

// JS 中并没有这种数据结构, 一般都用数组的 push 和 pop 模拟, 操作的都是栈顶的元素

class Stack {
  #items = [];

  /** 添加一个（或几个）新元素到栈顶。 */
  push(...args) {
    return this.#items.push(...args);
  }

  /** 移除栈顶的元素，同时返回被移除的元素。 */
  pop() {
    return this.#items.pop();
  }

  /** 返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返回它）。 */
  peek() {
    return this.#items[this.#items.length - 1];
  }

  /** 如果栈里没有任何元素就返回true，否则返回false。 */
  isEmpty() {
    return !this.#items.length;
  }

  /** 移除栈里的所有元素 */
  clear() {
    this.#items = [];
  }

  /** 返回栈里的元素个数。这个方法和数组的length属性很类似。 */
  size() {
    return this.#items.length;
  }
}

// 十进制转为二进制: 要把十进制转化成二进制，我们可以将该十进制数字和2整除（二进制是满二进一），直到结果是0为止。
function divideBy(n) {
  n = Number(n);
  if (!n) return '0';

  let remStack = new Stack(),
    s = '';
  while (n > 0) {
    remStack.push(Math.floor(n % 2));
    n = Math.floor(n / 2);
  }

  while (!remStack.isEmpty()) {
    s += remStack.pop();
  }
  return s;
}

console.log(divideBy(233)); // 11101001
console.log(divideBy(10)); // 1010
console.log(divideBy(1000)); // 1111101000

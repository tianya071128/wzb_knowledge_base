// 集合是由一组无序且唯一（即不能重复）的项组成的。
// 可以把集合想象成一个既没有重复元素，也没有顺序概念的数组。
// Set 类可以看成是 JS 的集合实现

// #region ------------ 模拟实现 Set ------------
class CustomSet {
  /** 使用对象来存储值 */
  #items = {};

  /** 向集合添加一个新的项 */
  add(value) {
    if (this.has(value)) return false;

    this.#items[value] = value;
    return true;
  }

  /** 从集合移除一个值 */
  remove(value) {
    if (!this.has(value)) return false;

    delete this.#items[value];
    return true;
  }

  /** 如果值在集合中，返回true，否则返回false */
  has(value) {
    return this.#items.hasOwnProperty(value);
  }

  /** 移除集合中的所有项 */
  clear() {
    this.#items = {};
  }

  /** 返回集合所包含元素的数量。与数组的length属性类似 */
  size() {
    return Object.keys(this.#items).length;
  }

  /** 返回一个包含集合中所有值的数组 */
  values() {
    return Object.keys(this.#items);
  }
}

// #endregion

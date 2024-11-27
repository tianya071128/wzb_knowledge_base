// 集合、字典和散列表可以存储不重复的值。在集合中，我们感兴趣的是每个值本身，并把它
// 当作主要元素。在字典中，我们用[键，值]的形式来存储数据。在散列表中也是一样（也是以[键，值]对的形式来存储数据）。

// 字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。字典也称作映射。

// Map 类可以看成是 JS 的集合实现

// #region ------------ 字典的模拟实现 ------------
class Dictionary {
  #items = {};

  /** 向字典中添加新元素 */
  set(key, value) {
    this.#items[key] = value;
  }

  /** 通过使用键值来从字典中移除键值对应的数据值 */
  remove(key, value) {
    if (!this.has(key)) return false;

    delete this.#items[key];
    return true;
  }

  /** 如果某个键值存在于这个字典中，则返回true，反之则返回false */
  has(key) {
    return this.#items.hasOwnProperty(key);
  }

  /** 通过键值查找特定的数值并返回 */
  get(key) {
    return this.#items[key];
  }

  /** 将这个字典中的所有元素全部删除 */
  clear() {
    this.#items = {};
  }

  /** 返回字典所包含元素的数量。与数组的length属性类似 */
  size() {
    return this.keys().length;
  }

  /** 将字典所包含的所有键名以数组形式返回 */
  keys() {
    return Object.keys(this.#items);
  }

  /** 将字典所包含的所有数值以数组形式返回 */
  values() {
    return Object.values(this.#items);
  }
}
// #endregion

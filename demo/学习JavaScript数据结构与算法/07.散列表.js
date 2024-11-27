// 散列算法的作用是尽可能快地在数据结构中找到一个值。
// 使用散列函数，就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后返回值在表中的地址。

// #region ------------ 模拟散列表 ------------
class HashTable {
  #table = [];

  /** 根据组成key的每个字符的ASCII码值的和得到一个数字 */
  static loseloseHashCode(key) {
    let hash = 0;
    for (const s of key) {
      hash += s.charCodeAt(0);
    }
    return hash % 37;
  }

  /** 向散列表增加一个新的项（也能更新散列表） */
  put(key, value) {
    const i = HashTable.loseloseHashCode(key);
    this.#table[i] = value;
  }

  /** 根据键值从散列表中移除值 */
  remove(key) {
    this.#table[HashTable.loseloseHashCode(key)] = undefined;
  }

  /** 返回根据键值检索到的特定的值 */
  get(key) {
    const i = HashTable.loseloseHashCode(key);
    return this.#table[i];
  }

  print() {
    console.log(this.#table);
  }
}
var hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
hash.print();
// #endregion

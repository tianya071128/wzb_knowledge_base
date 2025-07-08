/*
 * @lc app=leetcode.cn id=677 lang=javascript
 * @lcpr version=30204
 *
 * [677] 键值映射
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var MapSum = function () {
  /** 字典树 */
  this.dict = new Map();
  /** 缓存 key -- 如果键 key 已经存在，那么原来的键值对 key-value 将被替代成新的键值对 */
  this.keyMap = new Map();
};

/**
 * @param {string} key
 * @param {number} val
 * @return {void}
 */
MapSum.prototype.insert = function (key, val) {
  /**
   * 如果键 key 已经存在，那么原来的键值对 key-value 将被替代成新的键值对
   *  - 如果已经存在, 那么就将 val 重置一下即可
   */
  let temp = val;
  if (this.keyMap.has(key)) {
    temp = val - this.keyMap.get(key);
  }
  this.keyMap.set(key, val);

  // 添加到字典树, 并且在经过的地方计算和
  let dict = this.dict;
  for (const s of key) {
    const curDict = dict.get(s) ?? new Map();

    // 计算和
    curDict.set('sum', (curDict.get('sum') ?? 0) + temp);

    dict.set(s, curDict);
    dict = curDict;
  }
};

/**
 * @param {string} prefix
 * @return {number}
 */
MapSum.prototype.sum = function (prefix) {
  let dict = this.dict;
  for (const s of prefix) {
    dict = dict?.get(s);
  }

  return dict?.get('sum') ?? 0;
};

/**
 * Your MapSum object will be instantiated and called as such:
 * var obj = new MapSum()
 * obj.insert(key,val)
 * var param_2 = obj.sum(prefix)
 */
// @lc code=end

/*
// @lcpr case=start
// ["MapSum","insert","sum","insert","sum","insert","insert","sum"]\n[[],["apple",3],["ap"],["app",2],["ap"],["apple",5],["apple",1],["apple"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = MapSum;
// @lcpr-after-debug-end

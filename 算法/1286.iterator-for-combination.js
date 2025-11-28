/*
 * @lc app=leetcode.cn id=1286 lang=javascript
 * @lcpr version=30204
 *
 * [1286] 字母组合迭代器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} characters
 * @param {number} combinationLength
 */
var CombinationIterator = function (characters, combinationLength) {
  this.pList = new Array(combinationLength).fill(0).map((item, i) => i); // 建立指针集合
  this.characters = characters;
};

/**
 * @return {string}
 */
CombinationIterator.prototype.next = function () {
  /**
   * 取 pList 中对应位置的字符, 之后在调整指针位置
   */
  let ans = '';
  for (const p of this.pList) {
    ans += this.characters[p];
  }

  /**
   * 调整指针的位置:
   *  1. 首先找到需要调整位置的指针索引
   *  2. 将该索引之后的指针都重置一遍
   */
  let i = this.pList.length - 1;
  while (
    i > 0 &&
    // 判断指针的位置为最后一个
    this.pList[i] === this.characters.length - 1 - (this.pList.length - 1 - i)
  ) {
    i--;
  }

  // 从 i 开始的指针下移一位
  this.pList[i]++;
  for (let j = i + 1; j < this.pList.length; j++) {
    this.pList[j] = this.pList[j - 1] + 1;
  }

  return ans;
};

/**
 * @return {boolean}
 */
CombinationIterator.prototype.hasNext = function () {
  /**
   * 判断是否存在下一个比较简单, 只需要判断 pList 第一个指针的位置
   */
  return this.pList[0] <= this.characters.length - this.pList.length;
};

/**
 * Your CombinationIterator object will be instantiated and called as such:
 * var obj = new CombinationIterator(characters, combinationLength)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=next
// paramTypes= ["string[]","string[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["CombinationIterator", "next", "hasNext"]\n[["abcdefgh", 8], [], []]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = next;
// @lcpr-after-debug-end

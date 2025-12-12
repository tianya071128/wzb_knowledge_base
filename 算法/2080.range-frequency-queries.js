/*
 * @lc app=leetcode.cn id=2080 lang=javascript
 * @lcpr version=30204
 *
 * [2080] 区间内查询数字的频率
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 */
var RangeFreqQuery = function (arr) {
  /**
   * 1. 哈希表存储数字的索引
   * 2. 二分搜索找到对应的区间
   */
  /** @type {Map<number, string[]>} */
  let hash = new Map();
  for (let i = 0; i < arr.length; i++) {
    let list = hash.get(arr[i]) ?? [];
    list.push(i);

    hash.set(arr[i], list);
  }

  this.hash = hash;
};

/**
 * @param {number} left
 * @param {number} right
 * @param {number} value
 * @return {number}
 */
RangeFreqQuery.prototype.query = function (left, right, value) {
  let arr = this.hash.get(value);

  if (!arr) return 0;

  // 二分搜索找到左右指针
  let ansL = 0,
    ansR = 0,
    l = 0, // 用于二分搜索的指针
    r = arr.length - 1; // 用于二分搜索的指针
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);

    if (arr[mid] > left) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  // 不满足
  if (l > arr.length - 1) return 0;

  // 继续找右区间指针
  ansL = l;
  r = arr.length - 1;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);

    if (arr[mid] >= right) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  return Math.min(l, arr.length - 1) - ansL + 1;
};

/**
 * Your RangeFreqQuery object will be instantiated and called as such:
 * var obj = new RangeFreqQuery(arr)
 * var param_1 = obj.query(left,right,value)
 */
// @lc code=end

/*
// @lcpr case=start
// ["RangeFreqQuery", "query", "query"]\n[[[12, 33, 4, 56, 22, 2, 34, 33, 22, 12, 34, 56]], [1, 2, 4], [0, 11, 33]]\n
// @lcpr case=end

 */

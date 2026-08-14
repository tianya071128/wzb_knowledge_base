/*
 * @lc app=leetcode.cn id=1640 lang=javascript
 * @lcpr version=30204
 *
 * [1640] 能否连接形成数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number[][]} pieces
 * @return {boolean}
 */
var canFormArray = function (arr, pieces) {
  /**
   * 因为都不相同, 所以记录下 arr 元素的索引去比较 pieces 的即可
   */
  /** @type {Map<number, number>} 索引表 */
  let hash = new Map();
  for (let i = 0; i < arr.length; i++) {
    const n = arr[i];

    hash.set(n, i);
  }

  for (const arr of pieces) {
    /** @type {number} 当前元素对应的索引 */
    let i;

    for (let j = 0; j < arr.length; j++) {
      let cur = hash.get(arr[j]);

      if (cur == null || cur !== (i ?? cur - 1) + 1) return false;

      i = cur;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [15,88]\n[[88],[15]]\n
// @lcpr case=end

// @lcpr case=start
// [49,18,16]\n[[16,18,49]]\n
// @lcpr case=end

// @lcpr case=start
// [91,4,64,78]\n[[78],[4,64],[91]]\n
// @lcpr case=end

 */

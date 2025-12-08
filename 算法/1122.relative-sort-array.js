/*
 * @lc app=leetcode.cn id=1122 lang=javascript
 * @lcpr version=30204
 *
 * [1122] 数组的相对排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number[]}
 */
var relativeSortArray = function (arr1, arr2) {
  /**
   * - 给 arr2 中的元素用索引编一下号
   * - 排序 arr1 时, 如果两个元素都不在 arr2 时, 就升序排序
   */
  let hash = new Map();
  for (let i = 0; i < arr2.length; i++) {
    hash.set(arr2[i], i);
  }

  return arr1.sort((a, b) => {
    // 只要有一个存在 arr2, 就按照索引大小排序
    if (hash.has(a) || hash.has(b)) {
      return (hash.get(a) ?? Infinity) - (hash.get(b) ?? Infinity);
    }

    return a - b;
  });
};
// @lc code=end

/*
// @lcpr case=start
// [2,3,1,3,2,4,6,7,9,2,19]\n[2,1,4,3,9,6]\n
// @lcpr case=end

// @lcpr case=start
// [28,6,22,8,44,17]\n[22,28,8,6]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=954 lang=javascript
 * @lcpr version=30204
 *
 * [954] 二倍数对数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var canReorderDoubled = function (arr) {
  /**
   * 按照题意: arr[2 * i + 1] = 2 * arr[2 * i] --> 也就是说: 偶数项(0、2、4) 是 奇数项 的值一半
   *
   * 那么只要得出数组中的项能够两两配对，就满足要求
   *  1. 计算出每项的值的个数
   *  2. 排序: 负数则降序, 正数则升序
   *  2. 在遍历 arr, 找出配对项, 并且需要将值map中减去1
   */

  // 1. 计算出每项的值的个数
  let map = new Map(),
    pairNum = 0;
  for (const item of arr) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }

  // 2. 排序
  arr.sort((a, b) => {
    if (a < 0 && b < 0) return b - a;

    return a - b;
  });

  // 3. 找出配对项
  for (const item of arr) {
    // 如果对应值已经配对成功的
    if (map.get(item) === 0) continue;

    // 找到配对(如果是 0 的话, 那么 0 * 2 也是 0)
    if (map.get(item * 2) >= (item === 0 ? 2 : 1)) {
      pairNum++;
      map.set(item, map.get(item) - 1);
      map.set(item * 2, map.get(item * 2) - 1);
    }
  }

  return pairNum === arr.length / 2;
};
// @lc code=end

/*
// @lcpr case=start
// [2,4,0,0,8,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,2,6]\n
// @lcpr case=end

// @lcpr case=start
// [4,-2,2,-4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canReorderDoubled;
// @lcpr-after-debug-end

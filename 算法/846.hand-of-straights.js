/*
 * @lc app=leetcode.cn id=846 lang=javascript
 * @lcpr version=30204
 *
 * [846] 一手顺子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} hand
 * @param {number} groupSize
 * @return {boolean}
 */
var isNStraightHand = function (hand, groupSize) {
  // 无法分组, 直接返回
  if (hand.length % groupSize !== 0) return false;

  // 排序
  hand.sort((a, b) => a - b);

  // 哈希表记录下每个元素的个数
  const hash = new Map();
  for (const item of hand) {
    hash.set(item, (hash.get(item) ?? 0) + 1);
  }

  // 以每个元素为起点, 遍历找到
  for (const item of hand) {
    // 该元素已被消费, 处理下一个
    if ((hash.get(item) ?? 0) === 0) continue;

    // 以该元素为起点
    for (let i = 0; i < groupSize; i++) {
      const sum = hash.get(item + i) ?? 0;
      // 不能组成连续的
      if (sum === 0) return false;

      hash.set(item + i, sum - 1);
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,6,2,3,4,7,8]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,7,8,9]\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isNStraightHand;
// @lcpr-after-debug-end

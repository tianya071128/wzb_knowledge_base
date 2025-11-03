/*
 * @lc app=leetcode.cn id=888 lang=javascript
 * @lcpr version=30204
 *
 * [888] 公平的糖果交换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} aliceSizes
 * @param {number[]} bobSizes
 * @return {number[]}
 */
var fairCandySwap = function (aliceSizes, bobSizes) {
  /**
   * 1. 记录下两个人的总和, 比较一下需要交换的数量
   * 2. 遍历糖果处理, 判断对应人是否有差额的数量
   */
  let aliceHash = new Set(),
    bobHash = new Set(),
    aliceTotal = 0,
    bobTotal = 0,
    diff = 0; // 需要交换的差额

  for (const size of aliceSizes) {
    aliceHash.add(size);
    aliceTotal += size;
  }

  for (const size of bobSizes) {
    bobHash.add(size);
    bobTotal += size;
  }

  diff = (aliceTotal - bobTotal) / 2;

  // 遍历 aliceHash, 找到能够交换的糖果
  for (const size of aliceHash) {
    let res = size - diff;

    if (bobHash.has(res)) return [size, res];
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,1]\n[2,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n[2,3]\n
// @lcpr case=end

// @lcpr case=start
// [2]\n[1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,5]\n[2,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = fairCandySwap;
// @lcpr-after-debug-end

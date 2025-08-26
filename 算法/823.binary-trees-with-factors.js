/*
 * @lc app=leetcode.cn id=823 lang=javascript
 * @lcpr version=30204
 *
 * [823] 带因子的二叉树
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var numFactoredBinaryTrees = function (arr) {
  /**
   * 假设顶节点为 20, 那么他的分解因子就可能为
   * - 10 * 2
   * - 4 * 5
   *
   * 那么节点的 20 的组成数为
   *  - 1 本身
   *  - Sum(4) * Sum(5) * 2 --> 4 和 5 作为根节点的数量相乘, 并且 * 2 是因为可以作为左右节点
   *  - Sum(10) * Sum(2) * 2 --> 与上同理
   *
   * 还需注意的是, 如果因子是相同的, 就不能乘以2
   */
  arr.sort((a, b) => a - b);

  let ans = 0,
    hash = new Map(); // 存储每个数字作为根节点的个数

  for (let i = 0; i < arr.length; i++) {
    let min = 0,
      curAns = 1, // 当前数字作为根节点
      curNum = arr[i];

    // 从当前元素往左遍历, 找到因子
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] <= min) break;

      let n1 = arr[j];
      min = curNum / n1;
      if (Number.isInteger(min)) {
        curAns +=
          (hash.get(n1) ?? 0) * (hash.get(min) ?? 0) * (n1 !== min ? 2 : 1);
      }
    }

    hash.set(curNum, curAns);
    ans += curAns;
  }

  return ans % (10 ** 9 + 7);
};
// @lc code=end

/*
// @lcpr case=start
// [2, 4]\n
// @lcpr case=end

// @lcpr case=start
// [46,144,5040,4488,544,380,4410,34,11,5,3063808,5550,34496,12,540,28,18,13,2,1056,32710656,31,91872,23,26,240,18720,33,49,4,38,37,1457,3,799,557568,32,1400,47,10,20774,1296,9,21,92928,8704,29,2162,22,1883700,49588,1078,36,44,352,546,19,523370496,476,24,6000,42,30,8,16262400,61600,41,24150,1968,7056,7,35,16,87,20,2730,11616,10912,690,150,25,6,14,1689120,43,3128,27,197472,45,15,585,21645,39,40,2205,17,48,136]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numFactoredBinaryTrees;
// @lcpr-after-debug-end

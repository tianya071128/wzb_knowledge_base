/*
 * @lc app=leetcode.cn id=1130 lang=javascript
 * @lcpr version=30204
 *
 * [1130] 叶值的最小代价生成树
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var mctFromLeafValues = function (arr) {
  if (arr.length <= 1) return 0;

  /**
   * 分治:
   *  - 分别构建左右子树, 左右子树的叶节点至少需要 1 个
   *  - 此时, 可以确定左右子树的叶节点的最大值是多少, 那么就可以确定了当前树的最大值
   *  - 此时确定了左右子树的非叶节点的最小总和
   */
  let ans = Infinity;
  for (let i = 1; i < arr.length; i++) {
    // 左树的叶节点数组
    let leftArr = arr.slice(0, i),
      rightArr = arr.slice(i);

    ans = Math.min(
      ans,
      mctFromLeafValues(leftArr) +
        mctFromLeafValues(rightArr) +
        Math.max(...leftArr) * Math.max(...rightArr)
    );
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=mctFromLeafValues
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [6,2,4,5,6,8,10,15]\n
// @lcpr case=end

// @lcpr case=start
// [4,11]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = mctFromLeafValues;
// @lcpr-after-debug-end

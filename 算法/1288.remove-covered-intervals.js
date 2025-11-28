/*
 * @lc app=leetcode.cn id=1288 lang=javascript
 * @lcpr version=30204
 *
 * [1288] 删除被覆盖区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var removeCoveredIntervals = function (intervals) {
  /**
   * 贪心
   *  1. 排序: 先按左区间升序, 左区间相同情况下按右区间降序
   *  2. 查找被覆盖的区间的个数
   */
  intervals.sort((a, b) => {
    return a[0] === b[0] ? b[1] - a[1] : a[0] - b[0];
  });

  let delete_num = 0;
  for (let i = 0; i < intervals.length - 1; ) {
    // 以该项为基准, 查找后续被删除的区间, 只要后续区间的右区间小于等于该项右区间, 则说明被覆盖
    let r = intervals[i][1],
      j = i + 1;
    while (j < intervals.length && intervals[j][1] <= r) {
      j++;
      delete_num++;
    }

    // 交换基准点
    i = j;
  }

  return intervals.length - delete_num;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=removeCoveredIntervals
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[1,4],[3,6],[2,8],[1,2],[3,5],[1,70],[5,80],[11,52],[20,500]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeCoveredIntervals;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=769 lang=javascript
 * @lcpr version=30204
 *
 * [769] 最多能完成排序的块
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var maxChunksToSorted = function (arr) {
  /**
   * [1,0,3,2,4] -> [1,0] [3,2] [4]
   *
   *  观察可知, 从最后开始遍历, 每个区间的左右边界必须在下一个区间之前以及上个区间之后
   *
   * 倒序遍历
   *  1. 初始确定左边界
   */
  let p = arr.length - 1, // 左边界
    ans = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    // 更新左边界
    p = Math.min(p, arr[i]);

    // 如果正好边界与 i 相等, 说明区间的值是符合的
    if (p === i) {
      ans++;
      p = i - 1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,3,2,1,0]\n
// @lcpr case=end

// @lcpr case=start
// [1,0,2,3,4]\n
// @lcpr case=end

 */

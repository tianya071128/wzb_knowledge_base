/*
 * @lc app=leetcode.cn id=1331 lang=javascript
 * @lcpr version=30204
 *
 * [1331] 数组序号转换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var arrayRankTransform = function (arr) {
  let ans = new Array(arr.length).fill(0),
    list = arr.map((item, index) => [item, index]).sort((a, b) => a[0] - b[0]),
    index = 0;

  for (let i = 0; i < list.length; i++) {
    // 序号增加
    if (list[i][0] !== list[i - 1]?.[0]) {
      index++;
    }

    ans[list[i][1]] = index;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [40,10,10,20,30]\n
// @lcpr case=end

// @lcpr case=start
// [100,100,100]\n
// @lcpr case=end

// @lcpr case=start
// [37,12,28,9,100,56,80,5,12]\n
// @lcpr case=end

 */

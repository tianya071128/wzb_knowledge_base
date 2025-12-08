/*
 * @lc app=leetcode.cn id=1299 lang=javascript
 * @lcpr version=30204
 *
 * [1299] 将每个元素替换为右侧最大元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var replaceElements = function (arr) {
  let max = -1;
  for (let i = arr.length - 1; i >= 0; i--) {
    let temp = arr[i];
    arr[i] = max;

    max = Math.max(temp, max);
  }

  return arr;
};
// @lc code=end

/*
// @lcpr case=start
// [17,18,5,4,6,1]\n
// @lcpr case=end

// @lcpr case=start
// [400]\n
// @lcpr case=end

 */

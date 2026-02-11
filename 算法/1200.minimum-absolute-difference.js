/*
 * @lc app=leetcode.cn id=1200 lang=javascript
 * @lcpr version=30204
 *
 * [1200] 最小绝对差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number[][]}
 */
var minimumAbsDifference = function (arr) {
  /** 升序后, 最小的肯定是左右相邻的 */
  let ans = [],
    min = Infinity;

  arr.sort((a, b) => a - b);

  for (let i = 0; i < arr.length - 1; i++) {
    let d = arr[i + 1] - arr[i];

    if (d < min) {
      ans = [[arr[i], arr[i + 1]]];
      min = d;
    } else if (d === min) {
      ans.push([arr[i], arr[i + 1]]);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,6,10,15]\n
// @lcpr case=end

// @lcpr case=start
// [3,8,-10,23,19,-4,-14,27]\n
// @lcpr case=end

 */

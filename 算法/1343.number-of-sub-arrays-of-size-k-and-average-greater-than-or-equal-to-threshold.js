/*
 * @lc app=leetcode.cn id=1343 lang=javascript
 * @lcpr version=30204
 *
 * [1343] 大小为 K 且平均值大于等于阈值的子数组数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} threshold
 * @return {number}
 */
var numOfSubarrays = function (arr, k, threshold) {
  /** 滑动窗口 */
  let total = 0,
    l = 0,
    r = k - 1,
    ans = 0;
  for (let i = l; i <= r; i++) {
    total += arr[i];
  }

  while (r < arr.length) {
    if (total / k >= threshold) ans++;

    total = total - arr[l] + arr[r + 1];

    l++;
    r++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,2,2,2,5,5,5,8]\n3\n4\n
// @lcpr case=end

// @lcpr case=start
// [11,13,17,23,29,31,7,5,2,3]\n3\n5\n
// @lcpr case=end

 */

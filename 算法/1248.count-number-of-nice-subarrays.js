/*
 * @lc app=leetcode.cn id=1248 lang=javascript
 * @lcpr version=30204
 *
 * [1248] 统计「优美子数组」
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var numberOfSubarrays = function (nums, k) {
  /**
   * 1. 统计每个奇数项的索引
   * 2. 滑动窗口(大小为 k), 滑动奇数项索引的
   * 3. 计算公式: 1(窗口大小) + l(窗口据左边索引的距离) + r(窗口据右边索引的距离) + l * r
   */

  let arr = [],
    ans = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 1) arr.push(i);
  }

  // 增加头尾方便计算
  arr.unshift(-1);
  arr.push(nums.length);

  for (let i = 1; i < arr.length - k; i++) {
    let l = arr[i] - arr[i - 1] - 1,
      r = arr[i + k] - arr[i + k - 1] - 1;

    ans += 1 + l + r + l * r;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2,1,1]\n3\n
// @lcpr case=end

// @lcpr case=start
// [2,4,6]\n1\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,1,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,22,2,2,1,2,2,1,2,2,22,2,2,1,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,2]\n2\n
// @lcpr case=end

 */

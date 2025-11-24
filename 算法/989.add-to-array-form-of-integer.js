/*
 * @lc app=leetcode.cn id=989 lang=javascript
 * @lcpr version=30204
 *
 * [989] 数组形式的整数加法
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function (num, k) {
  // 模拟
  let carry = 0,
    p = num.length - 1,
    ans = [];

  while (p >= 0 || k > 0) {
    let cur = carry + (num[p] ?? 0) + (k % 10);

    ans.unshift(cur % 10);

    // 重置变量
    carry = Math.floor(cur / 10);
    p--;
    k = Math.floor(k / 10);
  }

  // 如果最后还进位了, 追加
  carry === 1 && ans.unshift(carry);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,0,2,5,4,5,6,7,0]\n342\n
// @lcpr case=end

// @lcpr case=start
// [2,7,4]\n181\n
// @lcpr case=end

// @lcpr case=start
// [2,1,5]\n806\n
// @lcpr case=end

 */

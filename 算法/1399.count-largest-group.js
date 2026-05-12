/*
 * @lc app=leetcode.cn id=1399 lang=javascript
 * @lcpr version=30204
 *
 * [1399] 统计最大组的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var countLargestGroup = function (n) {
  let list = Array(37).fill(0);
  for (let i = 1; i <= n; i++) {
    let res = 0,
      n = i;
    while (n > 0) {
      res += n % 10;
      n = Math.floor(n / 10);
    }

    list[res]++;
  }

  let ans = 0,
    maxIndex = 0;
  for (let i = 1; i < list.length; i++) {
    if (list[i] > list[maxIndex]) {
      ans = 1;
      maxIndex = i;
    } else if (list[i] === list[maxIndex]) {
      ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 13\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

 */

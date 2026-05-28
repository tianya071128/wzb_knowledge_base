/*
 * @lc app=leetcode.cn id=1535 lang=javascript
 * @lcpr version=30204
 *
 * [1535] 找出数组游戏的赢家
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var getWinner = function (arr, k) {
  // 如果到了比较了全部数组, 还没有结果的话, 那么必然是最大值获胜
  let ans = arr[0],
    n = 0;
  for (let i = 1; i < arr.length; i++) {
    const item = arr[i];

    // 重置变量
    if (item > ans) {
      n = 1;
      ans = item;
    } else {
      n++;
    }

    if (n >= k) return ans;
  }

  // 其他情况, 就是 ans
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,3,5,4,6,7]\n2\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1]\n10\n
// @lcpr case=end

// @lcpr case=start
// [1,9,8,2,3,7,6,4,5]\n7\n
// @lcpr case=end

// @lcpr case=start
// [1,11,22,33,44,55,66,77,88,99]\n1000000000\n
// @lcpr case=end

 */

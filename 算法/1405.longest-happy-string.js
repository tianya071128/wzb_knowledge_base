/*
 * @lc app=leetcode.cn id=1405 lang=javascript
 * @lcpr version=30204
 *
 * [1405] 最长快乐字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {string}
 */
var longestDiverseString = function (a, b, c) {
  /**
   * 贪心: 每次从最大中取值
   */
  let ans = '',
    arr = [
      ['a', a],
      ['b', b],
      ['c', c],
    ];

  while (arr[0][1] > 0 || arr[1][1] > 0 || arr[2][1] > 0) {
    // 先进行排序
    arr.sort((a, b) => b[1] - a[1]);

    let flag = true;

    // 选中当前选中项
    for (let i = 0; i < arr.length; i++) {
      if (ans[ans.length - 1] !== arr[i][0] && arr[i][1] > 0) {
        const n = Math.min(i === 0 ? 2 : 1, arr[i][1]); // 使用次数
        ans += arr[i][0].repeat(n);
        arr[i][1] -= n;
        flag = false;
        break;
      }
    }

    // 当该次没有选中一个的话, 说明不可选择了
    if (flag) break;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=longestDiverseString
// paramTypes= ["number","number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 1\n0\n3\n
// @lcpr case=end

// @lcpr case=start
// 2\n2\n1\n
// @lcpr case=end

// @lcpr case=start
// 7\n2\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = longestDiverseString;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=593 lang=javascript
 * @lcpr version=30204
 *
 * [593] 有效的正方形
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} p1
 * @param {number[]} p2
 * @param {number[]} p3
 * @param {number[]} p4
 * @return {boolean}
 */
var validSquare = function (p1, p2, p3, p4) {
  // 先执行排序
  const list = [p1, p2, p3, p4].sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];

    return a[1] - b[1];
  });
};
// @lc code=end

/*
// @lcpr case=start
// [0,0]\n[1,1]\n[1,0]\n[0,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,0]\n[1,1]\n[1,0]\n[0,12]\n
// @lcpr case=end

// @lcpr case=start
// [1,0]\n[-1,0]\n[0,1]\n[0,-1]\n
// @lcpr case=end

 */

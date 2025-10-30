/*
 * @lc app=leetcode.cn id=973 lang=javascript
 * @lcpr version=30204
 *
 * [973] 最接近原点的 K 个点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function (points, k) {
  /**
   * 排序
   */
  // 记录计算结果
  let hash = new Map();

  points.sort((a, b) => {
    if (!hash.has(a)) hash.set(a, Math.abs(a[0]) ** 2 + Math.abs(a[1]) ** 2);
    if (!hash.has(b)) hash.set(b, Math.abs(b[0]) ** 2 + Math.abs(b[1]) ** 2);

    return hash.get(a) - hash.get(b);
  });

  return points.slice(0, k);
};
// @lc code=end

/*
// @lcpr case=start
// [[1,3],[-2,2]]\n1\n
// @lcpr case=end

// @lcpr case=start
// [[3,3],[5,-1],[-2,4]]\n2\n
// @lcpr case=end

 */

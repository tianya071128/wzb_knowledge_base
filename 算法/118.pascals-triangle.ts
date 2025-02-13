/*
 * @lc app=leetcode.cn id=118 lang=typescript
 * @lcpr version=30204
 *
 * [118] 杨辉三角
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function generate(numRows: number): number[][] {
  let prev: number[] = [];
  return Array(numRows)
    .fill(0)
    .map<number[]>((item, index) => {
      if (index === 0) return [1];
      const res = [1];

      for (let i = 1; i < index; i++) {
        res.push(prev[i - 1] + prev[i]);
      }

      res.push(1);

      prev = res;

      return res;
    });
}
// @lc code=end

/*
// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1491 lang=javascript
 * @lcpr version=30204
 *
 * [1491] 去掉最低工资和最高工资后的工资平均值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} salary
 * @return {number}
 */
var average = function (salary) {
  let max = 0,
    min = 10 ** 7,
    sum = 0;

  for (const n of salary) {
    max = Math.max(max, n);
    min = Math.min(min, n);
    sum += n;
  }

  return (sum - max - min) / (salary.length - 2);
};
// @lc code=end

/*
// @lcpr case=start
// [4000,3000,1000,2000]\n
// @lcpr case=end

// @lcpr case=start
// [1000,2000,3000]\n
// @lcpr case=end

// @lcpr case=start
// [6000,5000,4000,3000,2000,1000]\n
// @lcpr case=end

// @lcpr case=start
// [8000,9000,2000,3000,6000,1000]\n
// @lcpr case=end

 */

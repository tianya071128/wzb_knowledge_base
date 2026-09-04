/*
 * @lc app=leetcode.cn id=2037 lang=typescript
 * @lcpr version=30204
 *
 * [2037] 使每位学生都有座位的最少移动次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function minMovesToSeat(seats: number[], students: number[]): number {
  let ans = 0; // 结果

  seats.sort((a, b) => a - b);
  students.sort((a, b) => a - b);

  for (let i = 0; i < seats.length; i++) {
    ans += Math.abs(seats[i] - students[i]);
  }

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// [3,1,5]\n[2,7,4]\n
// @lcpr case=end

// @lcpr case=start
// [4,1,5,9]\n[1,3,2,6]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,6,6]\n[1,3,2,6]\n
// @lcpr case=end

 */

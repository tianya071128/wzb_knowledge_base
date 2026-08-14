/*
 * @lc app=leetcode.cn id=1700 lang=javascript
 * @lcpr version=30204
 *
 * [1700] 无法吃午餐的学生数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} students
 * @param {number[]} sandwiches
 * @return {number}
 */
var countStudents = function (students, sandwiches) {
  /** @type {[number, number]} 学生喜欢的三明治数量 */
  let like = [0, 0];

  for (const student of students) {
    like[student]++;
  }

  for (let i = 0; i < sandwiches.length; i++) {
    if (like[sandwiches[i]]-- <= 0) return sandwiches.length - i;
  }

  return 0;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,0,0]\n[0,1,0,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,0,0,1]\n[1,0,0,0,1,1]\n
// @lcpr case=end

 */

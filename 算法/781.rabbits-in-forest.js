/*
 * @lc app=leetcode.cn id=781 lang=javascript
 * @lcpr version=30204
 *
 * [781] 森林中的兔子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} answers
 * @return {number}
 */
var numRabbits = function (answers) {
  /**
   * 贪心: 回答相同的取一组, 不同回答的只能是不同颜色
   *   --> 当为 0 时, 说明这个兔子的颜色是唯一的
   *   --> 当回答次数超过个数时, 后续的应该是不同颜色的
   *        - 例如 [2,2,2,2], 对于最后一个, 肯定跟前面的不相同
   */
  let ans = 0,
    map = new Map(); // 回答过的数量
  for (const n of answers) {
    if (n === 0) {
      ans++;
    } else if (!map.has(n)) {
      ans += n + 1;
      map.set(n, n);
    } else {
      map.set(n, map.get(n) - 1);

      // 如果为 0 次, 则去除
      if (map.get(n) === 0) {
        map.delete(n);
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,1,1]\n
// @lcpr case=end

 */

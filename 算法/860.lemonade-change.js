/*
 * @lc app=leetcode.cn id=860 lang=javascript
 * @lcpr version=30204
 *
 * [860] 柠檬水找零
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} bills
 * @return {boolean}
 */
var lemonadeChange = function (bills) {
  /**
   * 贪心: 当找零时, 优先找 10元的
   */
  let money5 = 0, // 拥有的 5 元个数
    money10 = 0; // 拥有的 10 元个数

  for (const bill of bills) {
    if (bill === 5) {
      money5++;
    } else if (bill === 10) {
      money5--;
      money10++;
      if (money5 < 0) return false;
    } else {
      // 首先减少 10 元
      let pocket = 15;

      if (money10) {
        money10--;
        pocket -= 10;
      }

      money5 -= pocket / 5;
      if (money5 < 0) return false;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [5,5,5,10,20]\n
// @lcpr case=end

// @lcpr case=start
// [5,5,10,10,20]\n
// @lcpr case=end

 */

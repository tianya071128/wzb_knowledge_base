/*
 * @lc app=leetcode.cn id=1029 lang=javascript
 * @lcpr version=30204
 *
 * [1029] 两地调度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} costs
 * @return {number}
 */
var twoCitySchedCost = function (costs) {
  /**
   * 贪心:
   *  - 以每个人的差值进行排序
   *  - 差值越大, 那么对结果的影响越大
   *  ---> 所以先对差值大的进行选择, 选择花费小
   *  ---> 直到选择了所有的人数
   */
  costs.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));

  let aSum = costs.length / 2,
    bSum = aSum,
    ans = 0;

  for (const cost of costs) {
    // 去 a 地
    if (bSum === 0 || (aSum > 0 && cost[0] < cost[1])) {
      aSum--;
      ans += cost[0];
    } else {
      bSum--;
      ans += cost[1];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[10,20],[30,200],[400,50],[30,20]]\n
// @lcpr case=end

// @lcpr case=start
// [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]\n
// @lcpr case=end

// @lcpr case=start
// [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = twoCitySchedCost;
// @lcpr-after-debug-end

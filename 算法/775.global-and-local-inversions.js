/*
 * @lc app=leetcode.cn id=775 lang=javascript
 * @lcpr version=30204
 *
 * [775] 全局倒置与局部倒置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isIdealPermutation = function (nums) {
  /**
   * 观察可知:
   *  - 当为局部倒置(单调递减栈)时, 那么必然是全局倒置
   *  - 并且当局部倒置的数量超过两个, 则必然存在2个以上的全局倒置, 此时数量就会不一致
   *  - 对于不行成局部倒置的元素, 必然是从0开始的递增(需要排除)
   */
  let addStack = [], //单调递增栈
    minusStack = []; // 局部倒置(单调递减栈)

  for (const n of nums) {
    // 满足单调递减栈
    if ((minusStack.at(-1) ?? Infinity) > n) {
      minusStack.push(n);

      // 如果超过两个, 那么必然不相同
      if (minusStack.length > 2) return false;
    }
    // 此时将 minusStack 添加至 addStack
    else if (minusStack.length === 1) {
      if (minusStack.at(-1) !== (addStack.at(-1) ?? -1) + 1) return false;

      addStack.push(minusStack.pop());
    }
    //此时重置变量
    else {
      minusStack = [];
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [0,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isIdealPermutation;
// @lcpr-after-debug-end

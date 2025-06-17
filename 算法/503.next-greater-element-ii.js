/*
 * @lc app=leetcode.cn id=503 lang=javascript
 * @lcpr version=30204
 *
 * [503] 下一个更大元素 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElements = function (nums) {
  // 1. 建立一个循环数组
  const list = nums.concat(nums.slice(0, -1));
  // 2. 单调递减栈
  const stock = [], // 存储的是 索引, 会有重复的值
    map = new Map(); // 建立映射: Map<索引, 下一个更大的值>
  for (let i = 0; i < list.length; i++) {
    const n = list[i];

    // 迭代栈, 如果栈中的元素比 n 小的话, 出栈并记录映射
    while (stock.length && n > list[stock.at(-1)]) {
      // 出栈
      map.set(stock.pop(), n);
    }

    // 当前元素入栈
    stock.push(i);
  }

  // 3. 迭代 nums, 在映射表中找到对应的值
  let ans = [];
  for (let i = 0; i < nums.length; i++) {
    // 有两次机会, 当前索引 and 下一次索引
    ans.push(map.get(i) ?? map.get(i + nums.length) ?? -1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,3]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=496 lang=javascript
 * @lcpr version=30204
 *
 * [496] 下一个更大元素 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var nextGreaterElement = function (nums1, nums2) {
  // 哈希表: 记录下 nums2 的元素下一个更大的元素
  const map = new Map(),
    stock = [];
  for (let i = 0; i < nums2.length; i++) {
    let n = nums2[i],
      len = stock.length - 1;

    // 迭代栈, 找出栈中比 n 小的数, 添加到哈希表中
    while (len >= 0 && stock[len] < n) {
      len--;
      map.set(stock.pop(), n);
    }

    stock.push(n);
  }

  // 遍历 nums1,在哈希表中查找
  const ans = [];
  for (const n of nums1) {
    ans.push(map.get(n) ?? -1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,1,2]\n[1,3,4,2]\n
// @lcpr case=end

// @lcpr case=start
// [2,4]\n[2,1,3,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = nextGreaterElement;
// @lcpr-after-debug-end

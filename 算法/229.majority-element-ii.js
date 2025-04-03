/*
 * @lc app=leetcode.cn id=229 lang=javascript
 * @lcpr version=30204
 *
 * [229] 多数元素 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var majorityElement = function (nums) {
  // 使用哈希表记录次数
  // const target = Math.floor(nums.length / 3);
  // const map = new Map();
  // for (const n of nums) {
  //   map.set(n, (map.get(n) ?? 0) + 1);
  // }

  // return [...map].filter((item) => item[1] > target).map((item) => item[0]);

  // 摩尔投票法
  const target = Math.floor(nums.length / 3);
  let candidate1 = nums[0];
  let candidate2 = nums[0];
  let count1 = 0;
  let count2 = 0;

  // 抵消阶段
  for (const n of nums) {
    if (candidate1 === n) {
      count1++;
    } else if (candidate2 === n) {
      count2++;
    }
    // 抵消阶段
    else {
      if (count1 && count2) {
        count1--;
        count2--;
      } else if (count1 === 0) {
        candidate1 = n;
        count1++;
      } else if (count2 === 0) {
        candidate2 = n;
        count2++;
      }
    }
  }

  // 计数阶段
  count1 = count2 = 0;
  for (const n of nums) {
    if (n === candidate1) count1++;
    if (n === candidate2) count2++;
  }

  let ans = [];
  if (count1 > target) ans.push(candidate1);
  if (count2 > target && candidate2 !== candidate1) ans.push(candidate2);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */

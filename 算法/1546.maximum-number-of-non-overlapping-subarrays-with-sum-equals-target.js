/*
 * @lc app=leetcode.cn id=1546 lang=javascript
 * @lcpr version=30204
 *
 * [1546] 和为目标值且不重叠的非空子数组的最大数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var maxNonOverlapping = function (nums, target) {
  // 利用前缀和和哈希表能够快速定位到当前元素之前和为 target 的索引
  // 如果z
  let prefixHash = new Set([[0]]),
    r = -1, // 已经处理到的右边界
    total = 0, // 已经遍历过的总和
    ans = 0;

  for (let i = 0; i < nums.length; i++) {
    const item = nums[i];

    total += item;
    prefixHash.set(total, i);

    // 判断是否存在子数组总和为 target && 并且小于 r
    let res = prefixHash.get(total - target);
    if (res != null && res !== i && res + 1 > r) {
      r = i;
      ans++;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxNonOverlapping
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [0,0,-1,0,-2,0,1,0,1,-2,-1,2,2,1]\n0\n
// @lcpr case=end

// @lcpr case=start
// [-1,3,5,1,4,2,-9]\n6\n
// @lcpr case=end

// @lcpr case=start
// [-2,6,6,3,5,4,1,2,8]\n10\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0]\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxNonOverlapping;
// @lcpr-after-debug-end

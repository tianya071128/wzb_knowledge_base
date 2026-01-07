/*
 * @lc app=leetcode.cn id=1282 lang=javascript
 * @lcpr version=30204
 *
 * [1282] 用户分组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} groupSizes
 * @return {number[][]}
 */
var groupThePeople = function (groupSizes) {
  let hash = new Map(),
    ans = [];

  for (let i = 0; i < groupSizes.length; i++) {
    let n = groupSizes[i],
      list = hash.get(n) ?? [];

    // 追加到集合中
    list.push(i);

    // 如果满编了, 那么就返回到结果中
    if (list.length === n) {
      ans.push(list);
      list = [];
    }

    hash.set(n, list);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,3,3,3,3,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,3,3,3,2]\n
// @lcpr case=end

 */

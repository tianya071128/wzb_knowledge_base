/*
 * @lc app=leetcode.cn id=1773 lang=javascript
 * @lcpr version=30204
 *
 * [1773] 统计匹配检索规则的物品数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} items
 * @param {string} ruleKey
 * @param {string} ruleValue
 * @return {number}
 */
var countMatches = function (items, ruleKey, ruleValue) {
  /** @type {number} 检索的对应索引 */
  let i = ruleKey === 'type' ? 0 : ruleKey === 'color' ? 1 : 2,
    /** @type {number} 结果 */
    ans = 0;

  for (const item of items) {
    if (item[i] === ruleValue) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [["phone","blue","pixel"],["computer","silver","lenovo"],["phone","gold","iphone"]]\n"color"\n"silver"\n
// @lcpr case=end

// @lcpr case=start
// [["phone","blue","pixel"],["computer","silver","phone"],["phone","gold","iphone"]]\n"type"\n"phone"\n
// @lcpr case=end

 */

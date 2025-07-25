/*
 * @lc app=leetcode.cn id=599 lang=javascript
 * @lcpr version=30204
 *
 * [599] 两个列表的最小索引总和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} list1
 * @param {string[]} list2
 * @return {string[]}
 */
var findRestaurant = function (list1, list2) {
  // 对 list2 进行哈希表计算索引位置
  const hash = new Map();
  for (let i = 0; i < list2.length; i++) {
    hash.set(list2[i], i);
  }

  // 遍历 list1, 计算结果
  let ans = [],
    minIndex = Infinity;

  for (let i = 0; i < list1.length; i++) {
    // 如果当前索引已经超出 minIndex, 也就没有必要继续
    if (i > minIndex) break;

    if (hash.has(list1[i])) {
      // 相同的话, 追加
      let cur = hash.get(list1[i]) + i;

      if (cur === minIndex) {
        ans.push(list1[i]);
      } else if (cur < minIndex) {
        ans = [list1[i]];
        minIndex = cur;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["Shogun", "Tapioca Express", "Burger King"]\n["Piatti", "The Grill at Torrey Pines", "HungryHunter Steakhouse", "Shogun"]\n
// @lcpr case=end

// @lcpr case=start
// ["Shogun", "Tapioca Express", "Burger King"]\n["KFC", "Shogun", "Burger King"]\n
// @lcpr case=end

// @lcpr case=start
// ["happy","sad","good"]\n["sad","happy","good"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findRestaurant;
// @lcpr-after-debug-end

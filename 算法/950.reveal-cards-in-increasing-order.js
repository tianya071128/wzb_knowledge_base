/*
 * @lc app=leetcode.cn id=950 lang=javascript
 * @lcpr version=30204
 *
 * [950] 按递增顺序显示卡牌
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} deck
 * @return {number[]}
 */
var deckRevealedIncreasing = function (deck) {
  /**
   * 倒推模拟:
   *  原步骤为:
   *    从牌组顶部抽一张牌，显示它，然后将其从牌组中移出。
   *    如果牌组中仍有牌，则将下一张处于牌组顶部的牌放在牌组的底部。
   *    如果仍有未显示的牌，那么返回步骤 1。否则，停止行动。
   *
   *  - 那么倒推模拟:
   *    先将牌组底部的值放置到顶部
   *    从 deck(排序后) 的最大值放置到牌组的顶部
   */

  deck.sort((a, b) => b - a);

  let ans = [];

  for (const item of deck) {
    // 先将牌组底部的值放置到顶部
    if (ans.length >= 2) {
      ans.unshift(ans.pop());
    }

    // 放置到牌组的顶部
    ans.unshift(item);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [17,13,11,2,3,5,7]\n
// @lcpr case=end

 */

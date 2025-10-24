/*
 * @lc app=leetcode.cn id=948 lang=javascript
 * @lcpr version=30204
 *
 * [948] 令牌放置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} tokens
 * @param {number} power
 * @return {number}
 */
var bagOfTokensScore = function (tokens, power) {
  /**
   * 贪心:
   *  1. 总结来讲, 有两个因素: 分数和能量
   *  2. 当消耗能量, 可获得分数
   *  3. 当消耗分数, 可获取能量
   *
   *
   * 那么:
   *  1. 那么应该尽可能的选择能量少的令牌来获得分数
   *  2. 同时应该尽可能的选择能量多的令牌来获得能量
   */

  // 1. 排序
  tokens.sort((a, b) => a - b);

  // 2. 双指针: 左指针指向能量少的用来获取分数、右指针指向能量多的用来获得能量
  let left = 0,
    right = tokens.length - 1,
    ans = 0; // 最大分数

  while (left <= right) {
    // 如果当前能量不支持获取令牌来得分的话, 就消耗分数来获取能量
    while (
      power < tokens[left] &&
      ans > 0 && // 可消耗分数
      right > left && // 可消耗令牌
      tokens[right] > tokens[left] // 获取的能量要比当前令牌要大, 这样才有意义
    ) {
      power += tokens[right];
      ans--;
      right--;
    }

    // 如果此时能量还是不足以加分的话, 那么就没有意义继续下去了
    if (power < tokens[left]) break;

    // 否则, 消耗能量加分
    ans++;
    power -= tokens[left];
    left++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [100]\n50\n
// @lcpr case=end

// @lcpr case=start
// [200,100]\n150\n
// @lcpr case=end

// @lcpr case=start
// [100,200,300,400]\n200\n
// @lcpr case=end

 */

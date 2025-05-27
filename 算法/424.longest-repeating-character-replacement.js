/*
 * @lc app=leetcode.cn id=424 lang=javascript
 * @lcpr version=30204
 *
 * [424] 替换后的最长重复字符
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 存在更优解, 只需遍历一次
 *  - 滑动窗口: 记录下当前窗口的字母出现的最大次数
 *      - 每次右指针向滑动时, 更新最大字母的次数(只需将向右滑动的字母与之前的最大次数比较)
 *      - 当 区间大小 - 最大字母的次数 + 1 > k 时, 那么就需要移动左指针, 收缩区间
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function (s, k) {
  /**
   * 不用动态规划的, 方案如下:
   *   1. 遍历一次, 记录下每个相同字符的索引位置
   *   2. 记录遍历相同字符的索引位置, 计算两个索引之间的距离, 并使用替换次数去替换两个索引之间的字符 --> 使用滑动窗口
   */
  let map = new Map(),
    len = s.length,
    ans = -Infinity;

  for (let i = 0; i < len; i++) {
    const list = map.get(s[i]) ?? [];
    list.push(i);
    map.set(s[i], list);
  }

  // 2. 使用滑动窗口计算
  map.forEach((indexs) => {
    let currentK = k, // 当前次数还能更改的
      left = 0, // 左指针
      right = 0; // 右指针
    while (right < indexs.length) {
      /**
       * 尝试移动右指针
       *  扩大区间
       */
      while (
        right < indexs.length - 1 &&
        indexs[right + 1] - indexs[right] <= currentK + 1
      ) {
        currentK -= indexs[right + 1] - indexs[right] - 1; // 减少可替换次数
        right++;
      }

      /**
       * 尝试移动左指针
       *  缩小区间
       */
      while (left < right && currentK < 0) {
        currentK += indexs[left + 1] - indexs[left] - 1; // 增加可替换次数
        left++;
      }

      // 计算大小
      ans = Math.min(
        Math.max(
          // 合理区间的大小
          indexs[right] -
            indexs[left] +
            1 +
            // 再加上还剩下替换的次数
            currentK,
          ans
        ),
        /** 不要超出最大宽度 */
        len
      );

      // 滑动窗口
      right++;
      // 修正次数
      if (right < indexs.length) {
        currentK = currentK - (indexs[right] - indexs[right - 1] - 1);
      }
    }
  });

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "BRJRRKNRBFOOKDEEGODTGMHNABMTHFNPTFRHRSEKKTFEQIKSIAJJMSDSLNSCNRNJFNFSIQDNMHDRIJIACLCJKATTFHDASGLRQSFN"\n10\n
// @lcpr case=end

// @lcpr case=start
// "ADSFASDFAS"\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = characterReplacement;
// @lcpr-after-debug-end

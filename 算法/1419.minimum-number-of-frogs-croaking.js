/*
 * @lc app=leetcode.cn id=1419 lang=javascript
 * @lcpr version=30204
 *
 * [1419] 数青蛙
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} croakOfFrogs
 * @return {number}
 */
var minNumberOfFrogs = function (croakOfFrogs) {
  /**
   * 每次碰到 c 就表示一只青蛙在叫, 加入队列
   *  - 期望找到 r 字符的队列
   *  - 找到其他字符
   *      -- 如果在队列中找到该字符的队列, 则继续下一个期望字符
   *      -- 否则组合不起来, 直接返回 -1
   * 如果继续碰到 c, 继续加入队列
   *
   * 结果就是队列中存在的最大值
   */
  let hash = {
      r: 0,
      o: 0,
      a: 0,
      k: 0,
      // 表示总数
      $: 0,
    },
    nextHash = {
      c: 'r',
      r: 'o',
      o: 'a',
      a: 'k',
    },
    ans = 0;

  for (const item of croakOfFrogs) {
    // 追加队列
    if (item === 'c') {
      hash[nextHash[item]]++;
      ans = Math.max(ans, ++hash['$']);
    } else if (hash[item]) {
      hash[item]--; // 继续下一个期望字符, 当前数量减一
      // 此时满足一个叫声
      if (item === 'k') {
        hash['$']--;
      } else {
        hash[nextHash[item]]++;
      }
    } else {
      // 不满足
      return -1;
    }
  }

  return hash['$'] !== 0 ? -1 : ans;
};
// @lc code=end

/*
// @lcpr case=start
// "c"\n
// @lcpr case=end

// @lcpr case=start
// "crcoakroak"\n
// @lcpr case=end

// @lcpr case=start
// "croakcrook"\n
// @lcpr case=end

 */

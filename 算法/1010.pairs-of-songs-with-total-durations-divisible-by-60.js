/*
 * @lc app=leetcode.cn id=1010 lang=javascript
 * @lcpr version=30204
 *
 * [1010] 总持续时间可被 60 整除的歌曲
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} time
 * @return {number}
 */
var numPairsDivisibleBy60 = function (time) {
  /**
   * 因为最大值为 time[i] <= 500, 所以我们遍历到某个元素, 检测之前的元素相加是否能被 60 整除
   */
  let ans = 0,
    hash = new Map([[time[0], 1]]),
    max = time[0];

  for (let i = 1; i < time.length; i++) {
    let diff = 60 - (time[i] % 60);
    while (diff <= max) {
      // 如果在之前的元素中存在, 那么就添加
      ans += hash.get(diff) ?? 0;
      diff += 60;
    }

    hash.set(time[i], (hash.get(time[i]) ?? 0) + 1);
    max = Math.max(time[i], max);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [30,20,150,100,40,60,60,60,60,60,60,60,60,5,41,5,2,41,5,4,24,1,5,14,5]\n
// @lcpr case=end

// @lcpr case=start
// [60,60,60]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1024 lang=javascript
 * @lcpr version=30204
 *
 * [1024] 视频拼接
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} clips
 * @param {number} time
 * @return {number}
 */
var videoStitching = function (clips, time) {
  /**
   * 贪心
   *  1. 先将数组排序, 左区间升序
   *  2. 从 0 开始, 选取跨度最长的
   *  3. 将上次选中的右区间作为起点, 从数组中选取跨度最长的
   *  4. 重复上述操作, 直到 time 或遍历 clips 结束
   */
  clips.sort((a, b) => a[0] - b[0]);

  let ans = 0,
    r = 0,
    p = 0;
  while (p < clips.length) {
    if (clips[p][0] <= r) {
      // 当前 r 在数组中的最大值
      let max = clips[p][1];
      p++;
      while (p < clips.length && clips[p][0] <= r) {
        max = Math.max(max, clips[p][1]);
        p++;
      }

      ans++;
      r = max;

      if (r >= time) return ans;
    } else {
      // 区间中断了
      break;
    }
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [[5,7],[1,8],[0,0],[2,3],[4,5],[0,6],[5,10],[7,10]]\n5\n
// @lcpr case=end

// @lcpr case=start
// [[0,1],[1,2], [4,5]]\n5\n
// @lcpr case=end

// @lcpr case=start
// [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]]\n9\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = videoStitching;
// @lcpr-after-debug-end

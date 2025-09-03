/*
 * @lc app=leetcode.cn id=874 lang=javascript
 * @lcpr version=30204
 *
 * [874] 模拟行走机器人
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} commands
 * @param {number[][]} obstacles
 * @return {number}
 */
var robotSim = function (commands, obstacles) {
  /**
   * 模拟
   *  - 使用哈希记录下障碍物
   */
  let hash = new Set(obstacles.map((item) => item.join())),
    direction = 0, // 方向 0 北方 | 1 东方 | 2 南方 | 3 西方
    location = [0, 0],
    ans = 0;

  // 遍历命令执行
  for (const command of commands) {
    if (command === -1) {
      direction = (direction + 1) % 4;
    } else if (command === -2) {
      direction = (direction + 3) % 4;
    } else {
      // 移动 X 轴还是 Y 轴
      let inx = direction === 0 || direction === 2 ? 1 : 0,
        n = direction === 0 || direction === 1 ? 1 : -1;
      // 移动
      for (let i = 1; i <= command; i++) {
        // 先移动
        let perv = location[inx];

        location[inx] = location[inx] + n;

        // 检测该位置是否为障碍物
        if (hash.has(location.join())) {
          // 回退
          location[inx] = perv;
          break;
        }
      }

      // 计算最远值
      ans = Math.max(ans, location[0] ** 2 + location[1] ** 2);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,-1,3]\n[]\n
// @lcpr case=end

// @lcpr case=start
// [4,-1,4,-2,4]\n[[2,4]]\n
// @lcpr case=end

// @lcpr case=start
// [6,-1,-1,6]\n[]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = robotSim;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=853 lang=javascript
 * @lcpr version=30204
 *
 * [853] 车队
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
var carFleet = function (target, position, speed) {
  /**
   * 1. 从距离终点最近的开始找
   * 2. 如果能追上前车, 那么就是同一个车队 --> 并且该车队以头部车的速度行驶着
   * 3. 否则就是不同的车队
   */
  let ans = 0,
    list = position
      .map((item, index) => [item, speed[index]])
      .sort((a, b) => b[0] - a[0]),
    prevTime = -Infinity;

  for (let i = 0; i < list.length; i++) {
    // 当前车辆需要的事件
    let curTime = (target - list[i][0]) / list[i][1];

    // 追不上了, 另起一个车队
    if (curTime > prevTime) {
      ans++;
      prevTime = curTime;
    }
  }
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 12\n[10,8,0,5,3]\n[2,4,1,1,3]\n
// @lcpr case=end

// @lcpr case=start
// 10\n[3]\n[3]\n
// @lcpr case=end

// @lcpr case=start
// 100\n[0,2,4]\n[4,2,1]\n
// @lcpr case=end

 */

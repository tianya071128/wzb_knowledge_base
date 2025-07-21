/*
 * @lc app=leetcode.cn id=735 lang=javascript
 * @lcpr version=30204
 *
 * [735] 小行星碰撞
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 使用栈模拟
 *
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function (asteroids) {
  /**
   * 原地对数组进行碰撞模拟
   */
  let p = 0; // 指针
  while (p < asteroids.length) {
    // 对上一个元素进行碰撞
    while (p > 0 && asteroids[p - 1] > 0 && asteroids[p] < 0) {
      // p 指针对应的行星碰撞胜出
      if (Math.abs(asteroids[p]) > Math.abs(asteroids[p - 1])) {
        // 删除 p - 1 项, 恢复 p 指针
        asteroids.splice(p - 1, 1);
        p--;
      }
      // p - 1 指针对应的行星碰撞胜出
      else if (Math.abs(asteroids[p]) < Math.abs(asteroids[p - 1])) {
        // 删除 p  项, 恢复 p 指针
        asteroids.splice(p, 1);
        p--;
      }
      // 同归于尽
      else {
        asteroids.splice(p - 1, 2);
        p -= 2;
      }
    }

    p++;
  }

  return asteroids;
};
// @lc code=end

/*
// @lcpr case=start
// [-2,-1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,8,-8,-5]\n
// @lcpr case=end

// @lcpr case=start
// [10,2,-5]\n
// @lcpr case=end

 */

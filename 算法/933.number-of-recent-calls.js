/*
 * @lc app=leetcode.cn id=933 lang=javascript
 * @lcpr version=30204
 *
 * [933] 最近的请求次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var RecentCounter = function () {
  // 队列存储
  this.list = [];
};

/**
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function (t) {
  this.list.push(t);

  while (this.list[0] < t - 3000) {
    // 出队
    this.list.shift();
  }

  return this.list.length;
};

/**
 * Your RecentCounter object will be instantiated and called as such:
 * var obj = new RecentCounter()
 * var param_1 = obj.ping(t)
 */
// @lc code=end

/*
// @lcpr case=start
// ["RecentCounter", "ping", "ping", "ping", "ping"]\n[[], [1], [100], [3001], [3002]]\n
// @lcpr case=end

 */

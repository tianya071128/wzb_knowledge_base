/*
 * @lc app=leetcode.cn id=1353 lang=javascript
 * @lcpr version=30204
 *
 * [1353] 最多可以参加的会议数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} events
 * @return {number}
 */
var maxEvents = function (events) {
  /**
   * 贪心
   *  1. 先进行排序, 按照起始时间排序
   *  2. 建立优先级队列(堆实现), 以右端点时间添加
   *  3. 初始化开始时间(初始为最小时间), 将开始时间等于这个时间的添加进优先级队列
   *  4. 取出堆顶元素, 判断是否为开始时间内, 否则就继续取出堆顶元素
   *  5. 开始时间往后增加, 继续将等于开始时间的项添加进优先级队列 --> 这一步是关键, 这样添加的元素就可以只比较结束时间, 没有想到这一层
   */
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[2,3],[3,4]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[2,3],[3,4],[1,2]]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=841 lang=javascript
 * @lcpr version=30204
 *
 * [841] 钥匙和房间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} rooms
 * @return {boolean}
 */
var canVisitAllRooms = function (rooms) {
  /**
   * 1. 哈希记录下进入的房间
   * 2. 栈记录拥有的钥匙
   */
  let stack = [0], // 初始拥有房间0的钥匙
    hash = new Set();

  while (stack.length) {
    let room = stack.pop();

    // 无需重复进入
    if (hash.has(room)) continue;

    hash.add(room);

    stack.push(...rooms[room]);
  }

  return hash.size === rooms.length;
};
// @lc code=end

/*
// @lcpr case=start
// [[1],[2],[3],[]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,3],[3,0,1],[2],[0]]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=1583 lang=javascript
 * @lcpr version=30204
 *
 * [1583] 统计不开心的朋友
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} preferences
 * @param {number[][]} pairs
 * @return {number}
 */
var unhappyFriends = function (n, preferences, pairs) {
  /**
   * 根据 preferences 获取到两两配对时的亲密度
   */
  /** @type {Map<string, number>} 获取到两两配对时的亲密度 */
  let hash = new Map();

  for (let i = 0; i < preferences.length; i++) {
    for (let j = 0; j < preferences[i].length; j++) {
      hash.set(`${i} -> ${preferences[i][j]}`, j);
    }
  }

  /** 根据 pairs 配对情况, 统计配对对象的亲密度 */
  /** @type {Map<number, number>} 只需要统计对应配对人员的亲密度 */
  let hash2 = new Map();

  for (const [x, y] of pairs) {
    hash2.set(x, hash.get(`${x} -> ${y}`));
    hash2.set(y, hash.get(`${y} -> ${x}`));
  }

  /** @type {number} 结果 */
  let ans = 0;

  /** 遍历每个朋友, 在查找当前匹配的亲密度更高的朋友的配对亲密度 */
  for (let i = 0; i < n; i++) {
    /** @type {number} 当前人员的配对亲密度 */
    let k = hash2.get(i);

    /** 遍历 */
    for (let j = 0; j < k; j++) {
      /** @type {number} */
      let x = hash2.get(preferences[i][j]);
      if (x >= j) {
        ans++;
        break;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=unhappyFriends
// paramTypes= ["number","number[][]","number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 4\n[[1, 2, 3], [3, 2, 0], [3, 1, 0], [1, 2, 0]]\n[[0, 1], [2, 3]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[2,1,3],[0,3,2],[1,0,3],[2,0,1]]\n[[0,1],[2,3]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[1, 3, 2], [2, 3, 0], [1, 3, 0], [0, 2, 1]]\n[[1, 3], [0, 2]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = unhappyFriends;
// @lcpr-after-debug-end

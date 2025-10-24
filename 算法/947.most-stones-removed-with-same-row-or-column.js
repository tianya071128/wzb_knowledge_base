/*
 * @lc app=leetcode.cn id=947 lang=javascript
 * @lcpr version=30204
 *
 * [947] 移除最多的同行或同列石头
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} stones
 * @return {number}
 */
var removeStones = function (stones) {
  /**
   * 1   1
   *   1
   * 1   1
   *
   * 如图所示: 本质上如果多个点都相连(只要 X 轴和 Y 轴上有一个相同), 那么这些连起来的点只需要留下一个, 其他的都可以移除
   */
  let ans = 0,
    /** @type Map<number, [number, number][]>  X 点上对应的 Y 点位 Map<X, number[]> */
    mapX = new Map(),
    /** @type Map<number, [number, number[]>  Y 点上对应的 X 点位 Map<Y, number[]> */
    mapY = new Map(),
    /** @type Set<string> 处理的点, 无需重复处理: X,Y 格式标识 */
    processe = new Set();

  // 先计算一下 X 轴和 Y 轴上点位
  for (const [X, Y] of stones) {
    mapX.set(X, [...(mapX.get(X) ?? []), [X, Y]]);
    mapY.set(Y, [...(mapY.get(Y) ?? []), [X, Y]]);
  }

  // 遍历 stones, 从每一项作为起点查找到所有相连的点
  for (const item of stones) {
    // 如果处理过, 那么直接退出
    if (processe.has(item.join(','))) continue;

    let queue = [item],
      cur;
    while ((cur = queue.pop())) {
      // 如果当前处理过, 不做处理
      if (processe.has(cur.join(','))) continue;

      // 否则将该点对应的其他点位添加到队列中
      queue.push(...mapX.get(cur[0]), ...mapY.get(cur[1]));

      // 将该点标注为已处理
      processe.add(cur.join(','));
    }

    ans++;
  }

  return stones.length - ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,1],[1,2],[1,3],[3,3],[2,3],[0,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0],[0,2],[1,1],[2,0],[2,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeStones;
// @lcpr-after-debug-end

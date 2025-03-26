/*
 * @lc app=leetcode.cn id=204 lang=typescript
 * @lcpr version=30204
 *
 * [204] 计数质数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function countPrimes(n: number): number {
  // 筛法：如埃拉托斯特尼筛法，它的基本思路是先把从 2 开始的自然数依次排列，然后把 2 的倍数（除 2 本身外）都划去，接着把 3 的倍数（除 3 本身外）划去，依次类推，剩下的数就是质数。
  // 从最小的质数 2 开始，把列表中所有 2 的倍数（除了 2 本身）标记为非质数（可以通过设置一个标识等方式来标记），然后找到下一个未被标记的数（也就是下一个质数，这里就是 3），
  // 再把 3 的倍数（除 3 本身外）都标记为非质数，依此类推，不断重复这个过程，直到遍历到的数大于 Math.sqrt(n)
  if (n <= 1) return 0;

  const list = Array(n - 2)
    .fill(0)
    .map((item, i) => i + 2);
  const max = Math.floor(Math.sqrt(n - 1));
  for (let i = 0; i <= max; i++) {
    // 如果被置为 0, 那么表示被标记为非质数
    if (list[i] === 0) continue;

    let base = list[i],
      double = 2,
      val = base * double;
    while (val <= n) {
      list[val - 2] = 0;
      val = base * ++double;
    }
  }
  return list.filter((item) => item !== 0).length;
}
// @lc code=end

/*
// @lcpr case=start
// 5\n    
// @lcpr case=end

// @lcpr case=start
// 5000000\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

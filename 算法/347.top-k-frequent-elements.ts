/*
 * @lc app=leetcode.cn id=347 lang=typescript
 * @lcpr version=30204
 *
 * [347] 前 K 个高频元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function topKFrequent(nums: number[], k: number): number[] {
  // 使用 Map 计数后转为数组
  const m = new Map<number, number>();
  for (const item of nums) {
    let n = (m.get(item) ?? 0) + 1;
    m.set(item, n);
  }

  const res = [...m.entries()].sort((a, b) => b[1] - a[1]);
  return res.slice(0, k).map((item) => item[0]);
}
topKFrequent([3, 0, 1, 0], 1);
// @lc code=end

/*
// @lcpr case=start
// [1,1,1,2,2,3]\n2\n
// @lcpr case=end

// @lcpr case=start
// [3,0,1,0]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

 */

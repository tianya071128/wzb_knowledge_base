/*
 * @lc app=leetcode.cn id=1562 lang=javascript
 * @lcpr version=30204
 *
 * [1562] 查找大小为 M 的最新分组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} m
 * @return {number}
 */
var findLatestStep = function (arr, m) {
  /**
   * 思路:
   *  - 使用数组来存储组的边界
   *  - 使用 hash 来存储每个组的长度对应的个数
   */
  let boundary = Array(arr.length)
      .fill(0)
      .map((item) => [-1, -1]),
    hash = new Map(),
    ans = -1;

  for (let i = 0; i < arr.length; i++) {
    let j = arr[i] - 1,
      l = j,
      r = j;

    // 扩展右边界
    if (boundary[j + 1]?.[1] >= 0) {
      r = boundary[j + 1]?.[1];

      // 清除之前的边界
      hash.set(r - j, hash.get(r - j) - 1);
    }

    // 扩展左边界
    if (boundary[j - 1]?.[0] >= 0) {
      l = boundary[j - 1]?.[0];

      // 清除之前的边界
      hash.set(j - l, hash.get(j - l) - 1);
    }

    // 添加当前组
    hash.set(r - l + 1, (hash.get(r - l + 1) ?? 0) + 1);
    boundary[l][1] = r;
    boundary[r][0] = l;

    if (hash.get(m)) ans = i + 1;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=findLatestStep
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [3,1,2]\n1\n
// @lcpr case=end

// @lcpr case=start
// [3,1,5,4,2]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [2,1]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findLatestStep;
// @lcpr-after-debug-end

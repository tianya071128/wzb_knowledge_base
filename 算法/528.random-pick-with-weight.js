/*
 * @lc app=leetcode.cn id=528 lang=javascript
 * @lcpr version=30204
 *
 * [528] 按权重随机选择
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} w
 */
var Solution = function (w) {
  /**
   * 1. 随机, 得出总和权重, 使用 Math.random() 获取总和之间的随机数
   * 2. 判断随机数的索引:
   *     2.1 计算前缀和
   *     2.2 二分搜索前缀和, 判断随机数处于哪个索引
   */
  let prefix = [];
  for (const item of w) {
    prefix.push((prefix.at(-1) ?? 0) + item);
  }

  this.prefix = prefix;
};

/**
 * @return {number}
 */
Solution.prototype.pickIndex = function () {
  let random = Math.ceil(Math.random() * this.prefix.at(-1));

  // 二分搜索确定索引
  let left = 0,
    right = this.prefix.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);

    if (this.prefix[mid] >= random) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(w)
 * var param_1 = obj.pickIndex()
 */
// @lc code=end

/*
// @lcpr case=start
// ["Solution","pickIndex"]\n[[[1]],[]]\n
// @lcpr case=end

// @lcpr case=start
// ["Solution","pickIndex","pickIndex","pickIndex","pickIndex","pickIndex"]\n[[[1,3]],[],[],[],[],[]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = Solution;
// @lcpr-after-debug-end

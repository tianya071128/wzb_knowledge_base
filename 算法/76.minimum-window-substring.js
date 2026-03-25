/*
 * @lc app=leetcode.cn id=76 lang=javascript
 * @lcpr version=30204
 *
 * [76] 最小覆盖子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
  /**
   * 滑动窗口
   */
  // 1. 计算出字符 t 的的字符个数
  let hash_t = new Map();
  for (const item of t) {
    hash_t.set(item, (hash_t.get(item) ?? 0) + 1);
  }

  // 2. 滑动窗口
  let l = 0,
    r = -1,
    diff = hash_t.size, // 表示没有匹配的字符个数
    hash_s = new Map(), // 窗口中的字符数量
    indexList = []; // 存储左右指针的索引
  while (r < s.length) {
    // 扩大右窗口
    while (
      diff && // 存在没有匹配的字符
      r < s.length // 还可以往右扩展
    ) {
      // 指针右移
      r++;

      // 当前匹配
      if (hash_t.has(s[r])) {
        let num = (hash_s.get(s[r]) ?? 0) + 1;
        hash_s.set(s[r], num);

        // 正好数量相同, 说明该匹配中
        if (num === hash_t.get(s[r])) diff--;
      }
    }

    // 已经匹配中
    if (!diff) {
      while (
        !hash_s.has(s[l]) || // 不存在 t 字符中
        hash_s.get(s[l]) > hash_t.get(s[l]) // 字符溢出了
      ) {
        // 先去除个数
        if (hash_s.has(s[l])) {
          hash_s.set(s[l], hash_s.get(s[l]) - 1);
        }
        l++; // 在移动指针
      }

      if (!indexList.length || indexList[1] - indexList[0] > r - l)
        indexList = [l, r];

      hash_s.set(s[l], hash_s.get(s[l]) - 1);
      l++; // 左指针右移一个
      diff++;
    }
  }

  // 根据左右指针生成结果
  if (!indexList.length) return '';

  let ans = '';
  for (let i = indexList[0]; i <= indexList[1]; i++) {
    ans += s[i];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "ADOBECODEBANC"\n"ABC"\n
// @lcpr case=end

// @lcpr case=start
// "aa"\n"aa"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n"aa"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minWindow;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=522 lang=javascript
 * @lcpr version=30204
 *
 * [522] 最长特殊序列 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} strs
 * @return {number}
 */
var findLUSlength = function (strs) {
  /**
   * 暴力破解, 使用一些方法优化
   *  1. 根据字符长度排序, 先处理长字符的
   */
  strs.sort((a, b) => b.length - a.length);

  // 比较s1是否为s2的子序列
  function compare(s1, s2) {
    if (s1.length > s2.length) return false;

    let p1 = 0,
      p2 = 0;
    while (p1 < s1.length && p2 < s2.length) {
      // 如果字符相同, 则两个指针向右移动
      if (s1[p1] === s2[p2]) {
        p1++;
        p2++;
      }
      // 不同时, 移动 p2 指针
      else {
        p2++;
      }
    }

    return p1 >= s1.length;
  }
  next: for (let i = 0; i < strs.length; i++) {
    for (let j = 0; j < strs.length; j++) {
      if (i !== j && compare(strs[i], strs[j])) {
        // 退出到外层循环
        continue next;
      }
    }

    // 是独有的子序列, 直接返回结果
    return strs[i].length;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// ["aba","cdc","eae"]\n
// @lcpr case=end

// @lcpr case=start
// ["aabbcc", "aabbcc","c","e","aabbcd"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findLUSlength;
// @lcpr-after-debug-end

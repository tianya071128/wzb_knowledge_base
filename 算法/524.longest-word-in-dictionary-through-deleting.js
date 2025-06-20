/*
 * @lc app=leetcode.cn id=524 lang=javascript
 * @lcpr version=30204
 *
 * [524] 通过删除字母匹配到字典里最长单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} dictionary
 * @return {string}
 */
var findLongestWord = function (s, dictionary) {
  // 按照 长度最长且字母序最小 排序
  dictionary.sort((a, b) => {
    // 相同长度比较字母序(按照字母表排序, 相关字符下比较下一个字符)
    if (a.length === b.length) {
      return a > b ? 1 : -1;
    } else {
      return b.length - a.length;
    }
  });

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
  // 从优先级最高的判断是否为子序列
  for (const s1 of dictionary) {
    if (compare(s1, s)) return s1;
  }

  return '';
};
// @lc code=end

/*
// @lcpr case=start
// "abpcplea"\n["ale","apple","monkey","plea"]\n
// @lcpr case=end

// @lcpr case=start
// "abpcplea"\n["abe","abc"]\n
// @lcpr case=end

 */

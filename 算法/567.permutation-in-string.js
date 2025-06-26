/*
 * @lc app=leetcode.cn id=567 lang=javascript
 * @lcpr version=30204
 *
 * [567] 字符串的排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 直接维护一个 s1.length 长度的窗口不就可以了, 在比较窗口字符数量与 s1 的比较
 *  --> 并且比较时, 直接使用数组记录字符个数, 并且使用 arr1.toString() === arr2.toString() 就可以比较了
 *
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  if (s1.length > s2.length) return false;

  /**
   * 滑动窗口: 关键是如何判断窗口中的字符与 s1 的关系
   */

  // 1. 先遍历 s1, 计算出 s1 字符的数据
  const map1 = new Map();
  for (const s of s1) {
    map1.set(s, (map1.get(s) ?? 0) + 1);
  }

  let left = 0,
    right = 0,
    map2 = new Map(map1); // 窗口字符跟 s1 字符的相差

  while (right < s2.length) {
    // 判断右指针的字符
    const s = s2[right];

    // 如果字符不在 s1 中, 那么就直接将左右指针放置到右指针的下一位, 重新开始
    if (!map1.has(s)) {
      map2 = new Map(map1);
      right++;
      left = right;
    }
    // 字符在 s1 中
    else {
      // 如果该字符已经没有剩余空间了, 那么就需要将左指针右移, 直至存在空间
      while (!map2.has(s)) {
        map2.set(s2[left], (map2.get(s2[left]) ?? 0) + 1);
        left++;
      }

      let n = map2.get(s); // 该字符剩余数量 - 肯定存在值

      // 直接减去 1 次，右指针右移
      if (n > 1) {
        map2.set(s, n - 1);
        right++;
      }
      // 如果正好为 1 次, 从 map2 中除去该字符
      else if (n === 1) {
        map2.delete(s);
        right++;

        // 字符数已经够了
        if (!map2.size) return true;
      }
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// "adc"\n"dcda"\n
// @lcpr case=end

// @lcpr case=start
// "eidboaoo"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkInclusion;
// @lcpr-after-debug-end

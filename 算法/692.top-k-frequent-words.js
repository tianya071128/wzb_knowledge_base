/*
 * @lc app=leetcode.cn id=692 lang=javascript
 * @lcpr version=30204
 *
 * [692] 前K个高频单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @param {number} k
 * @return {string[]}
 */
var topKFrequent = function (words, k) {
  /**
   * 1. 使用 哈希表 记录下字符次数
   * 2. 复用 words 桶排序, 桶内部使用数组接收
   * 3. 提取出 k 个数
   */
  const map = new Map();
  for (let i = 0; i < words.length; i++) {
    map.set(words[i], (map.get(words[i]) ?? 0) + 1);

    words[i] = [];
  }

  for (const [s, n] of map) {
    const list = words[n - 1];

    // 找到对应的位置
    let i = 0;
    while (list[i] && list[i] < s) {
      i++;
    }

    list.splice(i, 0, s);
  }

  // 提取出 k 个值
  const ans = [];
  for (let i = words.length - 1; i >= 0 && k > 0; i--) {
    ans.push(...words[i].slice(0, k));

    k -= words[i].length;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["i", "love", "leetcode", "i", "love", "coding"]\n2\n
// @lcpr case=end

// @lcpr case=start
// 4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = topKFrequent;
// @lcpr-after-debug-end

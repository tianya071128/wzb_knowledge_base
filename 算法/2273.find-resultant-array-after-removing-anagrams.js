/*
 * @lc app=leetcode.cn id=2273 lang=javascript
 * @lcpr version=30204
 *
 * [2273] 移除字母异位词后的结果数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {string[]}
 */
var removeAnagrams = function (words) {
  let cache = new Map(),
    ans = [];
  function helper(str) {
    if (cache.has(str)) return cache.get(str);

    let list = new Array(26).fill(0);
    for (const s of str) {
      list[s.charCodeAt() - 97]++;
    }

    // 重组字符
    let ans = '';
    for (let i = 0; i < list.length; i++) {
      ans += String.fromCharCode(i + 97).repeat(list[i]);
    }

    cache.set(str, ans);

    return ans;
  }

  for (let i = 0; i < words.length; i++) {
    if (
      ans.at(-1)?.length === words[i].length &&
      helper(ans.at(-1)) === helper(words[i])
    )
      continue;

    ans.push(words[i]);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=removeAnagrams
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["abbb","aaab"]\n
// @lcpr case=end

// @lcpr case=start
// ["a","b","c","d","e"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeAnagrams;
// @lcpr-after-debug-end

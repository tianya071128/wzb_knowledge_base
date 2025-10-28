/*
 * @lc app=leetcode.cn id=966 lang=javascript
 * @lcpr version=30204
 *
 * [966] 元音拼写检查器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} wordlist
 * @param {string[]} queries
 * @return {string[]}
 */
var spellchecker = function (wordlist, queries) {
  /**
   * 将单词列表处理分三个哈希
   *  1. 单词列表哈希 --> 用于完全匹配单词列表中的某个单词（区分大小写）
   *  2. 小写单词哈希 --> 用于匹配到大小写问题的单词时
   *  3. 元音小写单词 --> 用于匹配到元音错误的单词
   */
  let vowels = /[aeiou]/g, // 元音
    ans = [],
    wordMap = new Set(), // 单词列表 Set()
    lowWordMap = new Map(), // 小写单词 Map<string, 单词列表>
    vowelWordMap = new Map(); // 元音小写单词 Map<string, 单词列表> --> 将所有元音替换成 a, 并且小写
  for (const word of wordlist) {
    let lowWord = word.toLocaleLowerCase(), // 小写字母
      vowelWord = lowWord.replace(vowels, 'a'); // 元音小写单词
    wordMap.add(word);

    let lowWords = lowWordMap.get(lowWord) ?? [];
    lowWords.push(word);
    lowWordMap.set(lowWord, lowWords);

    let vowelWords = vowelWordMap.get(vowelWord) ?? [];
    vowelWords.push(word);
    vowelWordMap.set(vowelWord, vowelWords);
  }

  // 处理查询单词
  for (const querie of queries) {
    let lowQuerie = querie.toLocaleLowerCase(),
      vowelQuerie = lowQuerie.replace(vowels, 'a'); // 元音小写单词
    if (wordMap.has(querie)) {
      ans.push(querie);
    } else if (lowWordMap.has(lowQuerie)) {
      ans.push(lowWordMap.get(lowQuerie)[0]);
    } else if (vowelWordMap.has(vowelQuerie)) {
      ans.push(vowelWordMap.get(vowelQuerie)[0]);
    } else {
      ans.push('');
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["KiTe","kite","hare","Hare"]\n["kite","Kite","KiTe","Hare","HARE","Hear","hear","keti","keet","keto"]\n
// @lcpr case=end

// @lcpr case=start
// ["yellow"]\n["YellOw"]\n
// @lcpr case=end

 */

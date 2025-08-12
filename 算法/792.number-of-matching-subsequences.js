/*
 * @lc app=leetcode.cn id=792 lang=javascript
 * @lcpr version=30204
 *
 * [792] 匹配子序列的单词数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function (s, words) {
  /**
   * 子序列: 快速查找子序列
   *  - 遍历 s 的字符, 哈希表存储每个字符的索引
   *  - 当判断某个字符是否为 s 的子序列:
   *     - 遍历字符, 判断字符在 s 的最小索引
   *     - 注意字符的个数问题
   */
  let indexHash = new Map(),
    ans = 0;

  for (let i = 0; i < s.length; i++) {
    const list = indexHash.get(s[i]) ?? [];

    list.push(i);
    indexHash.set(s[i], list);
  }

  other: for (const str of words) {
    const numHash = new Map(); // 当前字符的个数哈希
    let prevIndex = -1; // 上一个字符的索引

    // 提前退出
    if (str.length > s.length) continue;

    for (let i = 0; i < str.length; i++) {
      let num = numHash.get(str[i]) ?? 0; // 当前字符在 indexHash 的起始位置
      const indexList = indexHash.get(str[i]) ?? []; // 索引集合

      // 判断最小索引是否在 prevIndex 之后
      while (num < indexList.length && indexList[num] < prevIndex) {
        num++;
      }

      // 判断该索引是否符合条件
      if (indexList[num] > prevIndex) {
        prevIndex = indexList[num];
        numHash.set(str[i], ++num); // 下一次就是下一个索引位置
      } else {
        // 退出当前字符的循环
        continue other;
      }
    }

    // 走到了这里就是符合条件的
    ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "rwpddkvbnnuglnagtvamxkqtwhqgwbqgfbvgkwyuqkdwhzudsxvjubjgloeofnpjqlkdsqvruvabjrikfwronbrdyyjnakstqjac"\n["wpddkvbnn","lnagtva","kvbnnuglnagtvamxkqtwhqgwbqgfbvgkwyuqkdwhzudsxvju","rwpddkvbnnugln","gloeofnpjqlkdsqvruvabjrikfwronbrdyyj","vbgeinupkvgmgxeaaiuiyojmoqkahwvbpwugdainxciedbdkos","mspuhbykmmumtveoighlcgpcapzczomshiblnvhjzqjlfkpina","rgmliajkiknongrofpugfgajedxicdhxinzjakwnifvxwlokip","fhepktaipapyrbylskxddypwmuuxyoivcewzrdwwlrlhqwzikq","qatithxifaaiwyszlkgoljzkkweqkjjzvymedvclfxwcezqebx"]\n
// @lcpr case=end

// @lcpr case=start
// "dsahjpjauf"\n["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numMatchingSubseq;
// @lcpr-after-debug-end

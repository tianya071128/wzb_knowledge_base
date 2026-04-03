/*
 * @lc app=leetcode.cn id=127 lang=javascript
 * @lcpr version=30204
 *
 * [127] 单词接龙
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function (beginWord, endWord, wordList) {
  /** @type {Map<string, string[]>} 哈希表记录下每个元素对应的转换序列 */
  let hash = new Map();

  /**
   * 工具方法, 判断 s1 和 s2 是否为转换序列
   * @param {string} s1
   * @param {string} s2
   */
  function helper(s1, s2) {
    if (s1 === s2 || s1.length !== s2.length) return;

    let diff = 1; // 只存在一个差异
    for (let i = 0; i < s1.length; i++) {
      if (s1[i] !== s2[i]) {
        if (--diff < 0) return;
      }
    }

    // 追加到 hash 中
    if (!hash.has(s1)) hash.set(s1, []);
    if (!hash.has(s2)) hash.set(s2, []);

    hash.get(s1).push(s2);
    hash.get(s2).push(s1);
  }

  // 将 beginWord 追加到集合中, 方便计算
  !wordList.includes(beginWord) && wordList.push(beginWord);

  for (let i = 0; i < wordList.length; i++) {
    for (let j = i + 1; j < wordList.length; j++) {
      helper(wordList[i], wordList[j]);
    }
  }

  /**
   * 广度优先搜索, 从 endWord 中反向查找到 beginWord
   *
   *                      cog(1)
   *     dog(2)     eog(2)      sog(2)      fog(2)
   *  eog(x)
   */
  let ans = 1,
    flag = new Set(),
    list = [endWord];

  while (list.length) {
    let next = []; // 下一次需要遍历的集合

    for (const item of list) {
      // 重复项不处理
      if (flag.has(item)) continue;

      // 找到了
      if (item === beginWord) return ans;

      flag.add(item);

      // 下一次需要处理的集合
      next.push(...(hash.get(item) ?? []));
    }

    list = next;
    ans++;
  }

  return 0;
};
// @lc code=end

/*
// @lcpr case=start
// "qa"\n"sq"\n["si","go","se","cm","so","ph","mt","db","mb","sb","kr","ln","tm","le","av","sm","ar","ci","ca","br","ti","ba","to","ra","fa","yo","ow","sn","ya","cr","po","fe","ho","ma","re","or","rn","au","ur","rh","sr","tc","lt","lo","as","fr","nb","yb","if","pb","ge","th","pm","rb","sh","co","ga","li","ha","hz","no","bi","di","hi","qa","pi","os","uh","wm","an","me","mo","na","la","st","er","sc","ne","mn","mi","am","ex","pt","io","be","fm","ta","tb","ni","mr","pa","he","lr","sq","ye"]\n
// @lcpr case=end

// @lcpr case=start
// "hit"\n"cog"\n["hot","dot","dog","lot","log"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = ladderLength;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=68 lang=javascript
 * @lcpr version=30204
 *
 * [68] 文本左右对齐
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
var fullJustify = function (words, maxWidth) {
  // 注意, 每个单词之间最少有一个空格

  // 1. 第一步, 确定每行的单词数量
  let lineWords = [],
    width = maxWidth,
    ans = [],
    total = 0; // 每行总长度
  for (let i = 0; i < words.length; i++) {
    // 判断该字符是否能够放入改行
    let word = words[i];
    if (word.length > width) {
      // 已经到一行, 构建一行结果
      helper();
    }

    // 将该字符追加进去
    lineWords.push(word);
    width -= word.length + 1;
    total += word.length;
  }

  // 最后构建一行
  helper(true);

  /**
   * @param {boolean} last 是否为最后一行
   */
  function helper(last = false) {
    let res = '';
    for (let i = 0; i < lineWords.length; i++) {
      // 在之前追加空格
      if (i !== 0) {
        if (last) {
          // 最后一行, 只有一个空格
          res += ' ';
        } else {
          // 其他的需要计算
          res += ' '.repeat(
            Math.floor((maxWidth - total) / (lineWords.length - 1)) +
              // 如果有多余的, 前面的空格需要多一些
              (i <= (maxWidth - total) % (lineWords.length - 1) ? 1 : 0)
          );
        }
      }

      res += lineWords[i];
    }

    // 末尾追加空格
    res += ' '.repeat(maxWidth - res.length);

    ans.push(res);

    // 重置相关变量
    lineWords = [];
    total = 0;
    width = maxWidth;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["This", "is", "an", "example", "of", "text", "justification."]\n16\n
// @lcpr case=end

// @lcpr case=start
// ["What","must","be","acknowledgment","shall","be"]\n16\n
// @lcpr case=end

// @lcpr case=start
// ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we"]\n20\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = fullJustify;
// @lcpr-after-debug-end

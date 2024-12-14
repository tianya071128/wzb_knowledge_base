/*
 * @lc app=leetcode.cn id=58 lang=javascript
 * @lcpr version=30204
 *
 * [58] 最后一个单词的长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function (s) {
  /**
   * 优化版: https://leetcode.cn/problems/length-of-last-word/solutions/1008504/zui-hou-yi-ge-dan-ci-de-chang-du-by-leet-51ih/
   *  反向遍历:
   *    1. 找到不为空的索引位置
   *    2. 继续遍历, 找到为空的索引位置
   */
  let index = s.length - 1;
  while (s[index] === ' ') {
    index--;
  }
  let wordLength = 0;
  while (index >= 0 && s[index] !== ' ') {
    wordLength++;
    index--;
  }
  return wordLength;
  /**
   * 虽然可以取巧使用 split 正则分割, 但还是遍历一次获取吧
   */
  // let left = (right = 0),
  //   flag = false; // 标识是否为连续字符中
  // for (let i = 0; i < s.length; i++) {
  //   const item = s[i];
  //   if (item !== ' ') {
  //     if (!flag) {
  //       left = i;
  //       flag = true;
  //     }
  //   } else {
  //     if (flag) {
  //       right = i;
  //       flag = false;
  //     }
  //   }
  // }
  // // 如果遍历完成, flag 为 true 的话, 重置右指针
  // if (flag) right = s.length;
  // return right - left;
};
// @lc code=end

/*
// @lcpr case=start
// "Hello World"\n
// @lcpr case=end

// @lcpr case=start
// "   fly me   to   the moon  "\n
// @lcpr case=end

// @lcpr case=start
// "luffy is still joyboy"\n
// @lcpr case=end

 */

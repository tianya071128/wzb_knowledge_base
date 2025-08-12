/*
 * @lc app=leetcode.cn id=809 lang=javascript
 * @lcpr version=30204
 *
 * [809] 情感丰富的文字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var expressiveWords = function (s, words) {
  /**
   * 1. 遍历计算 s 确定每个位置的字符以及重复顺序 --> 使用两个数组存储
   * 2. 遍历 words, 跟上面的数组进行判断是否符合条件
   */
  let strList = [], // 字符顺序
    repeatList = [], // 字符的重复顺序
    ans = 0;

  let prevStr = '',
    repeatNum = 0; // 重复次数
  for (const item of s) {
    if (item !== prevStr) {
      strList.push(item);
      repeatList.push(1);
      prevStr = item;
      repeatNum = 1;
    } else {
      repeatList[repeatList.length - 1]++;
    }
  }

  // 遍历 words, 跟上面的数组进行判断是否符合条件
  other: for (const strItem of words) {
    let sIndex = 0; // 在 strList 取值的索引

    // 每次计算
    let prevStr = strItem[0],
      repeatNum = 1;
    for (let i = 0; i < strItem.length; i++) {
      // 执行比较
      if (strItem[i + 1] !== prevStr) {
        // 不符合条件
        if (
          /** 字符不相同 */
          strList[sIndex] !== prevStr ||
          /** 字符更少, 更加无法扩张 */
          repeatList[sIndex] < repeatNum ||
          /** 无法从 1 扩张为 2 */
          (repeatNum === 1 && repeatList[sIndex] === 2)
        ) {
          continue other;
        }

        // 重置相关变量
        prevStr = strItem[i + 1];
        repeatNum = 1;
        sIndex++;
      }
      // 相同字符
      else {
        repeatNum++;
      }
    }

    // 字符 s 是否走到最后
    if (sIndex === strList.length) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abcd"\n["abc"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = expressiveWords;
// @lcpr-after-debug-end

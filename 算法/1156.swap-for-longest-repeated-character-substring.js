/*
 * @lc app=leetcode.cn id=1156 lang=javascript
 * @lcpr version=30204
 *
 * [1156] 单字符重复子串的最大长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @return {number}
 */
var maxRepOpt1 = function (text) {
  /**
   * 1. 使用 hash 记录下每个字符的索引位置
   * 2. 遍历这些字符索引, 计算最大重复字符数量
   */
  /** @type {Map<string, number[]>} Map<字符, 索引位置> */
  let hash = new Map(),
    ans = 0;

  for (let i = 0; i < text.length; i++) {
    hash.set(text[i], [...(hash.get(text[i]) ?? []), i]);
  }

  // 遍历字符索引
  for (const [s, indexs] of hash) {
    let p = 0; // 开始索引
    while (p < indexs.length) {
      let start = p, // 当次开始索引
        flag = false, // 是否已替换一个
        next; // 下次指针开始时, 如果是替换的地方, 那么就是开始替换的地方, 否则就是 start + 1

      // 什么情况下指针可以往右移动
      while (
        start < indexs.length - 1 &&
        (indexs[start + 1] - indexs[start] === 1 || // 正好是相邻的
          (!flag && indexs[start + 1] - indexs[start] === 2)) // 或者替换一个
      ) {
        // 如果是替换一个的话
        if (indexs[start + 1] - indexs[start] === 2) {
          next = start + 1;
          flag = true;
        }

        start++;
      }

      // 该次最大重复字符
      ans = Math.max(
        ans,
        Math.min(indexs[start] - indexs[p] + 1 + (flag ? 0 : 1), indexs.length)
      );
      p = flag ? next : start + 1;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxRepOpt1
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "ababa"\n
// @lcpr case=end

// @lcpr case=start
// "aaabaaasdadfasdfwer"\n
// @lcpr case=end

// @lcpr case=start
// "aaabbaaa"\n
// @lcpr case=end

// @lcpr case=start
// "aaaaa"\n
// @lcpr case=end

// @lcpr case=start
// "abcdef"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxRepOpt1;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=443 lang=javascript
 * @lcpr version=30204
 *
 * [443] 压缩字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[]} chars
 * @return {number}
 */
var compress = function (chars) {
  let ans = 0,
    currentS = chars[0], // 该次字符
    curN = 1; // 该次次数

  // 多遍历一次, 处理最后一个
  for (let i = 1; i <= chars.length; i++) {
    const item = chars[i];

    // 字符相同
    if (item === currentS) {
      curN++;
    }
    // 字符不同
    else {
      // 1. 先将字符添加到 chars 中
      chars[ans++] = currentS;
      // 2. 将次数添加到 chars 中
      if (curN > 1) {
        let carry = Math.floor(Math.log10(curN));
        while (carry >= 0) {
          chars[ans++] = String(Math.floor(curN / 10 ** carry));

          curN %= 10 ** carry;
          carry--;
        }
      }

      // 3. 重置值
      currentS = item;
      curN = 1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["a","a","b","b","c","c","c"]\n
// @lcpr case=end

// @lcpr case=start
// ["a"]\n
// @lcpr case=end

// @lcpr case=start
// ["a","b","b","b","b","b","b","b","b","b","b","b","b"]\n
// @lcpr case=end

 */

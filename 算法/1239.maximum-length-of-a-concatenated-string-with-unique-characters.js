/*
 * @lc app=leetcode.cn id=1239 lang=javascript
 * @lcpr version=30204
 *
 * [1239] 串联字符串的最大长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} arr
 * @return {number}
 */
var maxLength = function (arr) {
  /**
   * 回溯
   */
  let paths = new Set(), // 路径下包含的字符
    ans = 0;

  function dfs(start) {
    ans = Math.max(ans, paths.size);

    for (let i = start; i < arr.length; i++) {
      // 检测当前字符是否符合条件
      let flag = false,
        str = arr[i];

      // 不可能满足, 提前退出
      if (paths.size + str.length > 26) continue;

      for (let i = 0; i < str.length; i++) {
        if (paths.has(str[i])) {
          // 不符合条件, 之前加入的退出
          for (let j = 0; j < i; j++) {
            paths.delete(str[j]);
          }

          flag = true;
          break;
        } else {
          paths.add(str[i]);
        }
      }

      // 继续下一个
      if (!flag) {
        dfs(i + 1);

        // 之前的路径退出
        for (let i = 0; i < str.length; i++) {
          paths.delete(str[i]);
        }
      }
    }
  }

  dfs(0);

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxLength
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["un","iq","ue"]\n
// @lcpr case=end

// @lcpr case=start
// ["cha","r","act","ers"]\n
// @lcpr case=end

// @lcpr case=start
// ["abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz","abcdefghijklmnopqrstuvwxyz"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxLength;
// @lcpr-after-debug-end

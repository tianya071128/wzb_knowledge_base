/*
 * @lc app=leetcode.cn id=1415 lang=javascript
 * @lcpr version=30204
 *
 * [1415] 长度为 n 的开心字符串中字典序第 k 小的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var getHappyString = function (n, k) {
  let paths = [],
    ans = '';

  function dfs() {
    // 剪枝
    if (paths.length === n) {
      if (k === 1) {
        ans = paths.join('');
      }
      k--;

      return;
    }

    // 当前位置可增加字符
    let arr = ['a', 'b', 'c'];

    for (const item of arr) {
      // 不能与上一个字符相同
      if (item === paths.at(-1)) continue;

      paths.push(item);
      dfs();

      // 如果已经找到结果, 此时不处理其他树枝
      if (ans) break;

      paths.pop();
    }
  }

  dfs();

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=getHappyString
// paramTypes= ["number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 1\n3\n
// @lcpr case=end

// @lcpr case=start
// 1\n4\n
// @lcpr case=end

// @lcpr case=start
// 3\n9\n
// @lcpr case=end

// @lcpr case=start
// 2\n7\n
// @lcpr case=end

// @lcpr case=start
// 10\n100\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getHappyString;
// @lcpr-after-debug-end

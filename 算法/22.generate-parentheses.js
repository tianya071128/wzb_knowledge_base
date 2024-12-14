/*
 * @lc app=leetcode.cn id=22 lang=javascript
 * @lcpr version=30204
 *
 * [22] 括号生成
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  // 根据题解: https://leetcode.cn/problems/generate-parentheses/solutions/418884/shou-hua-tu-jie-gua-hao-sheng-cheng-hui-su-suan-fa/
  // 更优解
  const res = [];

  const dfs = (lRemain, rRemain, str) => {
    // 左右括号所剩的数量，str是当前构建的字符串
    if (str.length == 2 * n) {
      // 字符串构建完成
      res.push(str); // 加入解集
      return; // 结束当前递归分支
    }
    if (lRemain > 0) {
      // 只要左括号有剩，就可以选它，然后继续做选择（递归）
      dfs(lRemain - 1, rRemain, str + '(');
    }
    if (lRemain < rRemain) {
      // 右括号比左括号剩的多，才能选右括号
      dfs(lRemain, rRemain - 1, str + ')'); // 然后继续做选择（递归）
    }
  };

  dfs(n, n, ''); // 递归的入口，剩余数量都是n，初始字符串是空串
  return res;

  /**
   * 解题思路: 当 n 为 3 时, 结果为: ["((()))","(()())","(())()","()(())","()()()"]
   *
   *  观察可知, 每个字符串的长度都为 n * 2，以及每个位置的可能都是 ( 或者 ) --> 最开始必须是 (
   *  所以, 我们遍历一下 n*2-1 次(因为开始为时 "("), 而将每次的项分裂为可以插入括号 ( 和 )的
   */
  // let res = [
  //   {
  //     list: ['('],
  //     stack: ['('],
  //     num: n - 1,
  //   },
  // ];
  // // 遍历次数? -- 因为初始化了一个 (, 所以遍历次数应该为 n * 2 - 1
  // for (let i = 0; i < n * 2 - 1; i++) {
  //   // 将每一项分裂, 可能插入 ( 或者 ), 在合并成数组
  //   res = res
  //     .map((item) => {
  //       let currentRes = [];
  //       // 当前是否支持 ( 括号
  //       // 检测 ( 括号次数是否为 0
  //       if (item.num > 0) {
  //         currentRes.push({
  //           list: [...item.list, '('],
  //           stack: [...item.stack, '('],
  //           num: item.num - 1,
  //         });
  //       }
  //       // 当前是否支持 ) 括号
  //       // 检测当前栈是否支持插入 )
  //       if (item.stack.at(-1) === '(') {
  //         currentRes.push({
  //           list: [...item.list, ')'],
  //           stack: item.stack.filter(
  //             (item, index, arr) => index !== arr.length - 1
  //           ),
  //           num: item.num,
  //         });
  //       }
  //       return currentRes;
  //     })
  //     .flat();
  // }
  // return res.map((item) => item.list.join(''));
};
// @lc code=end

/*
// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = generateParenthesis;
// @lcpr-after-debug-end

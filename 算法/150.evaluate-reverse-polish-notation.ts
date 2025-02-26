/*
 * @lc app=leetcode.cn id=150 lang=typescript
 * @lcpr version=30204
 *
 * [150] 逆波兰表达式求值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function evalRPN(tokens: string[]): number {
  // 题目描述不太准确, 可见: https://baike.baidu.com/item/%E9%80%86%E6%B3%A2%E5%85%B0%E5%BC%8F/128437#5
  // 简单来讲, 就是将 tokens 从左至右入栈
  // 遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中
  const stock: number[] = [];
  for (const token of tokens) {
    if (token === '+') {
      const n1 = stock.pop() ?? 0;
      const n2 = stock.pop() ?? 0;
      stock.push(n1 + n2);
    } else if (token === '-') {
      const n1 = stock.pop() ?? 0;
      const n2 = stock.pop() ?? 0;
      stock.push(n2 - n1);
    } else if (token === '*') {
      const n1 = stock.pop() ?? 0;
      const n2 = stock.pop() ?? 0;
      stock.push(n1 * n2);
    } else if (token === '/') {
      const n1 = stock.pop() ?? 0;
      const n2 = stock.pop() ?? 0;
      let res = n2 / n1;
      // 向零截断
      res = res > 0 ? Math.floor(res) : Math.ceil(res);
      stock.push(res);
    } else {
      stock.push(Number(token));
    }
  }

  return stock.pop() ?? 0;
}
// @lc code=end

/*
// @lcpr case=start
// ["2","1","+","3","*"]\n
// @lcpr case=end

// @lcpr case=start
// ["4","13","5","/","+"]\n
// @lcpr case=end

// @lcpr case=start
// ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]\n
// @lcpr case=end

 */

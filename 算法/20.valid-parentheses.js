/*
 * @lc app=leetcode.cn id=20 lang=javascript
 * @lcpr version=30204
 *
 * [20] 有效的括号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  /**
   * 解决思路:
   *  1. 使用栈的数据结构概念
   *  2. 遍历 s, 遇到左括号就入栈, 遇到右括号就取栈顶的, 判断是否为同类型
   *      2.1 是同类型, 将匹配的出栈, 继续遍历
   *      2.2 如果不是同类型, 那么直接返回 false
   *  3. 遍历结束时, 如果栈是否还存在项
   *      3.1 存在的话, 返回 false
   *      3.2 不存在的话, 返回 true
   */
  if (s.length <= 1) return false;

  const map = {
    ')': '(',
    ']': '[',
    '}': '{',
  };
  const stack = [];
  const que = s.split('');
  for (const item of que) {
    const match = map[item];

    // 如果是右括号
    if (match) {
      // 取栈顶数据, 匹配是否为同类型
      if (stack.at(-1) !== match) return false;

      // 是同类型, 出栈
      stack.pop();
    }
    // 如果是左括号, 入栈
    else {
      stack.push(item);
    }
  }

  return !stack.length;
};
// @lc code=end

// @lc code=start 优化版本
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  // 优化1: 字符串长度不是偶数直接不匹配
  if (s.length % 2 === 1) return false;

  const map = {
    ')': '(',
    ']': '[',
    '}': '{',
  };
  const stack = [];
  // 优化2: forof 支持字符串
  for (const item of s) {
    const match = map[item];

    // 如果是右括号
    if (match) {
      // 优化3: 直接取栈顶数据
      const last = stack.pop();

      // 取栈顶数据, 匹配是否为同类型
      if (last !== match) return false;
    }
    // 如果是左括号, 入栈
    else {
      stack.push(item);
    }
  }

  return !stack.length;
};
// @lc code=end

/*
// @lcpr case=start
// "()"\n
// @lcpr case=end

// @lcpr case=start
// "()[]{}"\n
// @lcpr case=end

// @lcpr case=start
// "(]"\n
// @lcpr case=end

// @lcpr case=start
// "([])"\n
// @lcpr case=end

 */

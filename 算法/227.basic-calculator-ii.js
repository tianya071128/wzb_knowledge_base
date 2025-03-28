/*
 * @lc app=leetcode.cn id=227 lang=javascript
 * @lcpr version=30204
 *
 * [227] 基本计算器 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function (s) {
  /**
   * 使用数组: 模拟入栈和出栈、最后的时候使用队列形式
   *  1. 碰到数字, 入栈
   *  2. 碰到 + -，入栈
   *  3. 碰到 、 %，出栈一个数字以及与下一个数字计算出结果
   *      -> 将计算结果入栈
   *  4. 遍历完成后
   *  5. 使用队列结构, 从开头取出数字和操作符进行运算
   */
  let list = [],
    cur = 0,
    status = 'push'; // 当前状态
  while (cur < s.length) {
    let sub = s[cur];

    // 遇到数字, 解析数字
    if (/\d/.test(sub)) {
      let n = 0;
      do {
        n = n * 10 + Number(s[cur]);
        cur++;
      } while (/\d/.test(s[cur]));

      if (status === 'push') {
        list.push(n);
      } else if (status === '/') {
        list.push(Math.floor(list.pop() / n));
      } else if (status === '*') {
        list.push(list.pop() * n);
      }
      status = 'push';
    }
    // + 和 - 的操作
    else if (sub === '+' || sub === '-') {
      cur++;
      list.push(sub);
      status = 'push';
    }
    // / 和 0 的操作
    else if (sub === '/' || sub === '*') {
      status = sub;
      cur++;
    }
    // 其他, 空格
    else {
      cur++;
    }
  }

  // 处理加和减
  let ans = 0;
  status = '+';

  for (const n of list) {
    if (n === '+' || n === '-') {
      status = n;
    } else {
      ans = ans + n * (status === '+' ? 1 : -1);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "30+2*2"\n
// @lcpr case=end

// @lcpr case=start
// " 3/2 "\n
// @lcpr case=end

// @lcpr case=start
// " 3+5 / 2 "\n
// @lcpr case=end

 */

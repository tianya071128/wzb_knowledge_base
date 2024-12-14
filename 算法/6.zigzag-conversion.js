/*
 * @lc app=leetcode.cn id=6 lang=javascript
 * @lcpr version=30204
 *
 * [6] Z 字形变换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
  if (numRows <= 1) return s;
  /**
   * 解题思路:
   *  1. numRows 有多少行, 我们就添加多少个数组
   *  2. 遍历字符串 s, 我们只需要计算出遍历字符所处的行, 将其推入到对应的行数组中
   *
   *  假设为 3 行:
   *    0   4   8
   *    1 3 5 7 9
   *    2   6   10
   *
   *  假设为 4 行:
   *    0     6       12
   *    1   5 7    11 13
   *    2 4   8 10    14
   *    3     9       15
   *
   *  3. 观察上述可知, 一个循环对应的字符数量
   *      2行 --> 2 + (2 - 2) --> 2
   *      3行 --> 3 + (3 - 2) --> 4
   *      4行 --> 4 + (4 - 2) --> 6
   *  4. 所以字符所处的行的计算公式应该为:
   *
   */

  // let res = new Array(numRows).fill('').map((item) => []);
  // for (let i = 0; i < s.length; i++) {
  //   const item = s[i];
  //   let base = i % (numRows + (numRows - 2));
  //   let line;
  //   if (base < numRows) {
  //     line = base;
  //   } else {
  //     line = numRows - ((base + 1) % numRows) - 1;
  //   }
  //   res[line].push(item);
  // }
  // // 组装为字符串
  // return res.reduce((total, item) => total + item.join(''), '');

  /**
   * 优化: https://leetcode.cn/problems/zigzag-conversion/solutions/875873/js-jie-ti-zhi-xing-yong-shi-9894-nei-cun-amjm/
   *  思路:
   *    1. 类似于创建一个指针表示行数, 然后遍历s, 指针往下(或上)移动
   *    2. 移动的指针为 0 时, 指针方向为下, 当为 numRows - 1 时, 指针方向为上
   *
   */
  // 可能存在字符串长度没有行数多的情况，和一行的情况，就直接返回
  if (s.length <= numRows || numRows === 1) {
    return s;
  }
  // 创建一个数组，个数为行数
  const arr = new Array(numRows).fill('');
  // 当前字母对应的行
  let num = 0;
  // true 表示向下+ ，false 为向上-
  let plus = true;
  for (let i = 0; i < s.length; i++) {
    // 每次项当前行里添加字符串
    arr[num] += s[i];

    if (plus) {
      // 向下行+1
      num += 1;
    } else {
      // 向上行-1
      num -= 1;
    }

    if (num === 0) {
      // 再次到 0 说明到顶了要向下了，为true
      plus = true;
    }
    if (num === numRows - 1) {
      // 再次到 底部 说明要向上了，为false
      plus = false;
    }
  }
  return arr.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "PAYPALISHIRING"\n3\n
// @lcpr case=end

// @lcpr case=start
// "PAYPALISHIRING"\n4\n
// @lcpr case=end

// @lcpr case=start
// "A"\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = convert;
// @lcpr-after-debug-end

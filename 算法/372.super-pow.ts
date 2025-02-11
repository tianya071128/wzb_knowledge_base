/*
 * @lc app=leetcode.cn id=372 lang=typescript
 * @lcpr version=30204
 *
 * [372] 超级次方
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function superPow(a: number, b: number[]): number {
  // 备注, 正确逻辑, 后续实现
  // Math.pow(Math.pow(p, a), b) = Math.pow(p, a * b);
  // 倒序遍历 b, 采用如上公式分治

  // 如下方法超时

  // Math.pow(2147483647, 2) % 1337    ===   Math.pow(2147483647 % 1337, 2) % 1337
  // 所以先将 a 取模, 然后分治 b 用于指数取值
  if (b.length === 1 && b[0] === 1) return a % 1337;

  // 对数组进行除2
  let carry = false; // 是否进位
  let list = [...b];
  for (let index = 0; index < list.length; index++) {
    let n = list[index];

    // 取进位
    if (carry) n += 10;

    list[index] = Math.floor(n / 2);
    carry = n % 2 === 1;
  }
  // 去除开头 0
  if (list[0] === 0) list.shift();

  return (
    (superPow(a, list) * superPow(a, list) * (carry ? superPow(a, [1]) : 1)) %
    1337
  );
}
// @lc code=end

/*
// @lcpr case=start
// 2\n[3]\n
// @lcpr case=end

// @lcpr case=start
// 2\n[1,0]\n
// @lcpr case=end

// @lcpr case=start
// 1\n[4,3,3,8,5,2]\n
// @lcpr case=end

// @lcpr case=start
// 2147483647\n[2,0,0]\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=13 lang=javascript
 * @lcpr version=30204
 *
 * [13] 罗马数字转整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  // 先建立映射
  // const hash = new Map([
  //   ['I', 1],
  //   ['V', 5],
  //   ['X', 10],
  //   ['L', 50],
  //   ['C', 100],
  //   ['D', 500],
  //   ['M', 1000],
  //   ['IV', 4],
  //   ['IX', 9],
  //   ['XL', 40],
  //   ['XC', 90],
  //   ['CD', 400],
  //   ['CM', 900],
  // ]);
  // let total = 0;
  // // 遍历字符
  // for (let index = 0; index < s.length; index++) {
  //   const n = s[index];
  //   const n2 = s[index + 1];
  //   if (n2 && hash.has(n + n2)) {
  //     total += hash.get(n + n2);
  //     index++;
  //   } else {
  //     total += hash.get(n);
  //   }
  // }
  // return total;

  // 因为上述方法效率上较差, 故使用 object 替换 Map 试试
  const hash = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
    IV: 4,
    IX: 9,
    XL: 40,
    XC: 90,
    CD: 400,
    CM: 900,
  };
  let total = 0;
  // 遍历字符
  for (let index = 0; index < s.length; index++) {
    const n = s[index];
    const n2 = s[index + 1];
    if (n2 && hash[n + n2]) {
      total += hash[n + n2];
      index++;
    } else {
      total += hash[n];
    }
  }
  return total;
};
// @lc code=end

/*
// @lcpr case=start
// "III"\n
// @lcpr case=end

// @lcpr case=start
// "IV"\n
// @lcpr case=end

// @lcpr case=start
// "IX"\n
// @lcpr case=end

// @lcpr case=start
// "LVIII"\n
// @lcpr case=end

// @lcpr case=start
// "MCMXCIV"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = romanToInt;
// @lcpr-after-debug-end

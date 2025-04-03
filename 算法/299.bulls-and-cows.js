/*
 * @lc app=leetcode.cn id=299 lang=javascript
 * @lcpr version=30204
 *
 * [299] 猜数字游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} secret
 * @param {string} guess
 * @return {string}
 */
var getHint = function (secret, guess) {
  // 对于公牛: 数字和确切位置都猜对了，遍历数字字符串判断
  // 对于奶牛：数字猜对了但是位置不对，遍历数字过程中，记录下数字的数量（需要排查掉公牛数量）
  let bulls = 0, // 公牛数量
    cows = 0, // 奶牛数量
    secretMap = new Map();
  /** @type Map<string, number> */
  let guessMap = new Map();

  for (let i = 0; i < secret.length; i++) {
    let n1 = secret[i],
      n2 = guess[i];

    // 公牛数量
    if (n1 === n2) {
      bulls++;
    } else {
      secretMap.set(n1, (secretMap.get(n1) ?? 0) + 1);
      guessMap.set(n2, (guessMap.get(n2) ?? 0) + 1);
    }
  }

  guessMap.forEach((v, k) => (cows += Math.min(v, secretMap.get(k) ?? 0)));

  return `${bulls}A${cows}B`;
};
// @lc code=end

/*
// @lcpr case=start
// "1807"\n"7810"\n
// @lcpr case=end

// @lcpr case=start
// "1123"\n"0111"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getHint;
// @lcpr-after-debug-end

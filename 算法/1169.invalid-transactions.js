/*
 * @lc app=leetcode.cn id=1169 lang=javascript
 * @lcpr version=30204
 *
 * [1169] 查询无效交易
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} transactions
 * @return {string[]}
 */
var invalidTransactions = function (transactions) {
  /**
   * 转为数组后, 进行排序
   */
  transactions = transactions
    .map((item) => item.split(','))
    .sort((a, b) => {
      // 按照同名的交易时间排序
      if (a[0] !== b[0]) return a[0] > b[0] ? 1 : -1;

      // 其他的按照交易时间排序
      return Number(a[1]) - Number(b[1]);
    });

  let ans = new Set();

  for (let i = 0; i < transactions.length; i++) {
    // 如果交易金额大于 1000, 直接判断无效
    if (Number(transactions[i][2]) > 1000) {
      ans.add(transactions[i]);
      continue;
    }

    // 否则往回找, 同名但不同城市的交易
    let j = i - 1;
    while (
      j >= 0 &&
      transactions[i][0] === transactions[j][0] &&
      transactions[i][3] === transactions[j][3]
    ) {
      j--;
    }

    if (j >= 0 && transactions[i][1] - transactions[j][1] <= 60) {
      ans.add(transactions[i]);
      ans.add(transactions[j]);
    }
  }

  return [...ans].map((item) => item.join(','));
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=invalidTransactions
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["alice,20,800,mtv","alice,50,100,mtv","alice,51,100,frankfurt"]\n
// @lcpr case=end

// @lcpr case=start
// ["alice,20,800,mtv","alice,50,1200,mtv"]\n
// @lcpr case=end

// @lcpr case=start
// ["alice,20,800,mtv","bob,50,1200,mtv"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = invalidTransactions;
// @lcpr-after-debug-end

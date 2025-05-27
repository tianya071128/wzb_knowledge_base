/*
 * @lc app=leetcode.cn id=402 lang=javascript
 * @lcpr version=30204
 *
 * [402] 移掉 K 位数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function (num, k) {
  let ans = num[0],
    i = 1;
  while (i < num.length) {
    const n = num[i];

    /**
     * 将当前项与 ans 的最后一项比较, 如果较小则清除 ans 最后一项
     */
    while (
      ans.length >= 0 &&
      Number(ans[ans.length - 1]) > Number(n) &&
      k > 0
    ) {
      ans = ans.slice(0, -1);
      k--;
    }

    // 将当前项追加进 ans
    ans += n;
    i++;
  }

  // 有可能 k 没有删除完成, 此时需要从 ans 截取
  ans = ans.slice(0, ans.length - k);

  // 去除前导0
  while (ans[0] === '0') {
    ans = ans.slice(1);
  }

  return ans ? ans : '0';
};
// @lc code=end

/*
// @lcpr case=start
// "1432219"\n3\n
// @lcpr case=end

// @lcpr case=start
// "1234"\n2\n
// @lcpr case=end

// @lcpr case=start
// "10"\n2\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=93 lang=typescript
 * @lcpr version=30204
 *
 * [93] 复原 IP 地址
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function restoreIpAddresses(s: string): string[] {
  // 回溯, 以 . 的位置推进, 回溯三次后, 检查是否满足 IP 地址规则
  let ans: string[] = [],
    points: number[] = []; // 点的位置

  /**
   *
   * @param start 开始计算的位置
   */
  function dfs(start: number) {
    // . 的次数已到3次, 只需检测最后一个 . 后面的数字是否符合要求
    if (points.length === 3) {
      let res = points.reduce<string>((total, item, index) => {
        total = total + s.slice((points[index - 1] ?? -1) + 1, item + 1) + '.';

        // 如果是最后一个元素, 追加最后一个
        if (index === points.length - 1) {
          const res = s.slice(item + 1, s.length);
          // 当最后一位不符合当在 0 到 255 之间, 且不能含有前导 0, 直接 '' 标识剪枝
          if (
            res === '' ||
            Number(res) > 255 ||
            (res.length > 1 && res[0] === '0')
          )
            return '';

          total = total + res;
        }

        return total;
      }, '');

      if (res) {
        ans.push(res);
      }

      return;
    }

    // 插入 . --> 当在 0 到 255 之间, 使用 do while 语句是确保首位
    let total: number = Number(s[start]);
    do {
      points.push(start);
      dfs(++start);
      points.pop();

      total = total * 10 + Number(s[start]);
    } while (total <= 255 && total >= 10 && start + 1 < s.length);
  }

  dfs(0);

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// "25525511135"\n
// @lcpr case=end

// @lcpr case=start
// "0000"\n
// @lcpr case=end

// @lcpr case=start
// "101023"\n
// @lcpr case=end

 */

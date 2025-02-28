/*
 * @lc app=leetcode.cn id=165 lang=typescript
 * @lcpr version=30204
 *
 * [165] 比较版本号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function compareVersion(version1: string, version2: string): number {
  /**
   * 解题思路:
   *  1. 迭代 version1 和 version2
   *  2. 提取出每一个修订号的版本, 默认为 0
   */
  let pointer1 = 0,
    pointer2 = 0;

  while (pointer1 < version1.length || pointer2 < version2.length) {
    // 查找 version1 的当前修订号
    let r1 = 0;
    while (version1[pointer1] !== '.' && pointer1 < version1.length) {
      r1 = r1 * 10 + Number(version1[pointer1]);
      pointer1++;
    }
    // 指针移动一位
    pointer1++;

    let r2 = 0;
    while (version2[pointer2] !== '.' && pointer2 < version2.length) {
      r2 = r2 * 10 + Number(version2[pointer2]);
      pointer2++;
    }
    // 指针移动一位
    pointer2++;

    // 比较版本
    if (r1 > r2) {
      return 1;
    } else if (r1 < r2) {
      return -1;
    }
  }

  return 0;
}
// @lc code=end

/*
// @lcpr case=start
// "1.2"\n"1.10"\n
// @lcpr case=end

// @lcpr case=start
// "1.01.1"\n"1.001"\n
// @lcpr case=end

// @lcpr case=start
// "1.0"\n"1.0.0.0"\n
// @lcpr case=end

 */

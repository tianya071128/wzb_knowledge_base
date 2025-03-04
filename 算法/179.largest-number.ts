/*
 * @lc app=leetcode.cn id=179 lang=typescript
 * @lcpr version=30204
 *
 * [179] 最大数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function largestNumber(nums: number[]): string {
  /**
   * 排序 nums
   */
  nums.sort((a, b) => {
    let s1 = String(a) + String(b),
      s2 = String(b) + String(a);
    for (let index = 0; index < s1.length; index++) {
      if (Number(s1[index]) > Number(s2[index])) return -1;
      if (Number(s2[index]) > Number(s1[index])) return 1;
    }

    return 0;
  });

  let res = '';
  for (const item of nums) {
    res += item === 0 && res === '0' ? '' : item;
  }

  return res;
}
// @lc code=end

/*
// @lcpr case=start
// [0,0]\n
// @lcpr case=end

/*
// @lcpr case=start
// [10,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,30,34,5,9]\n
// @lcpr case=end

 */

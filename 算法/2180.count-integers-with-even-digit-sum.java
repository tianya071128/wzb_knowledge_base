/*
 * @lc app=leetcode.cn id=2180 lang=java
 * @lcpr version=30204
 *
 * [2180] 统计各位数字之和为偶数的整数个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countEven(int num) {
        int ans = 0;

        for (int i = 1; i <= num; i++) {
            if (hasSumEven(i))
                ans++;
        }

        return ans;
    }

    public boolean hasSumEven(int num) {
        int sum = 0;

        while (num > 0) {
            sum += (num % 10);

            num /= 10;
        }

        return sum % 2 == 0;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 4\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 30\n
 * // @lcpr case=end
 * 
 */

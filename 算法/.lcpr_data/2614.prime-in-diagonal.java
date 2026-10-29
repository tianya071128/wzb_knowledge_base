/*
 * @lc app=leetcode.cn id=2614 lang=java
 * @lcpr version=30204
 *
 * [2614] 对角线上的质数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int diagonalPrime(int[][] nums) {
        int ans = 0;

        for (int i = 0; i < nums.length; i++) {
            if (hasPrime(nums[i][i]))
                ans = Math.max(ans, nums[i][i]);

            if (hasPrime(nums[i][nums.length - 1 - i]))
                ans = Math.max(ans, nums[i][nums.length - 1 - i]);
        }

        return ans;
    }

    public boolean hasPrime(int num) {
        if (num < 2)
            return false;

        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0)
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[1,2,3],[5,6,7],[9,10,11]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,2,3],[5,17,7],[9,11,10]]\n
 * // @lcpr case=end
 * 
 */

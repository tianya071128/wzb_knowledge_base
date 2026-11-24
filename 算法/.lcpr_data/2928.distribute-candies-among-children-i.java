/*
 * @lc app=leetcode.cn id=2928 lang=java
 * @lcpr version=30204
 *
 * [2928] 给小朋友们分糖果 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int distributeCandies(int n, int limit) {
        return _distributeCandies(n, limit, 3);
    }

    public int _distributeCandies(int n, int limit, int count) {
        int ans = 0;

        if (count == 1) {
            if (n <= limit)
                return 1;

            return 0;
        }

        for (int i = 0; i <= Math.min(n, limit); i++) {
            ans += _distributeCandies(n - i, limit, count - 1);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 5\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 3\n3\n
 * // @lcpr case=end
 * 
 */

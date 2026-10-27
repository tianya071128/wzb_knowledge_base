/*
 * @lc app=leetcode.cn id=2591 lang=java
 * @lcpr version=30204
 *
 * [2591] 将钱分给最多的儿童
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int distMoney(int money, int children) {
        if (money < children || (children == 1 && money == 4))
            return -1;

        // 先去除每个人一美元
        money -= children;

        int ans = 0;
        for (int i = 1; i < children; i++) {
            if (money < 7) {
                money = 0;
                break;
            }

            ans++;
            money -= 7;
        }

        // 如果最后剩下三块，就不能分配给最后一个人
        if (money == 3)
            ans--;

        if (money == 7)
            ans++;

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 20\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 16\n2\n
 * // @lcpr case=end
 * 
 */

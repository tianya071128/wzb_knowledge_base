/*
 * @lc app=leetcode.cn id=2383 lang=java
 * @lcpr version=30204
 *
 * [2383] 赢得比赛需要的最少训练时长
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minNumberOfHours(int initialEnergy, int initialExperience, int[] energy, int[] experience) {
        /**
         * 先去应战, 如果精力或经验缺少的话, 那么就说明应该训练
         */
        int ans = 0;

        for (int i = 0; i < energy.length; i++) {
            if (initialEnergy <= energy[i]) {
                ans += (energy[i] - initialEnergy + 1);
                initialEnergy = energy[i] + 1;
            }

            if (initialExperience <= experience[i]) {
                ans += (experience[i] - initialExperience + 1);
                initialExperience = experience[i] + 1;
            }

            initialEnergy -= energy[i];
            initialExperience += experience[i];
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 5\n3\n[1,4,3,2]\n[2,6,3,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 2\n4\n[1]\n[3]\n
 * // @lcpr case=end
 * 
 */

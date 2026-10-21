/*
 * @lc app=leetcode.cn id=2469 lang=java
 * @lcpr version=30204
 *
 * [2469] 温度转换
 */


// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public double[] convertTemperature(double celsius) {
        return new double[]{celsius + 273.15, celsius * 1.8 + 32};
    }
}
// @lc code=end



/*
// @lcpr case=start
// 36.50\n
// @lcpr case=end

// @lcpr case=start
// 122.11\n
// @lcpr case=end

 */


/*
 * @lc app=leetcode.cn id=2299 lang=java
 * @lcpr version=30204
 *
 * [2299] 强密码检验器 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean strongPasswordCheckerII(String password) {
        if (password.length() < 8)
            return false;

        boolean flag1 = false,
                flag2 = false,
                flag3 = false,
                flag4 = false;
        String str = "!@#$%^&*()-+";

        for (int i = 0; i < password.length(); i++) {
            char cur = password.charAt(i);
            if (i != 0 && cur == password.charAt(i - 1))
                return false;

            // 验证小写字母
            if (!flag1 && cur >= 'a' && cur <= 'z')
                flag1 = true;

            // 验证大写字母
            if (!flag2 && cur >= 'A' && cur <= 'Z')
                flag2 = true;

            // 验证数字
            if (!flag3 && cur >= '0' && cur <= '9')
                flag3 = true;

            // 验证特殊字符
            if (!flag4 && str.contains(Character.toString(cur)))
                flag4 = true;
        }

        return flag1 && flag2 && flag3 && flag4;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "IloveLe3tcode!"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "Me+You--IsMyDream"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "1aB!"\n
 * // @lcpr case=end
 * 
 */

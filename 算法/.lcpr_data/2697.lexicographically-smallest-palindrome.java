/*
 * @lc app=leetcode.cn id=2697 lang=java
 * @lcpr version=30204
 *
 * [2697] 字典序最小回文串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String makeSmallestPalindrome(String s) {
        char[] arr = s.toCharArray();
        int l = 0, r = arr.length - 1;

        while (l < r) {
            if (arr[l] > arr[r]) {
                arr[l] = arr[r];
            } else if (arr[l] < arr[r]) {
                arr[r] = arr[l];
            }

            l++;
            r--;
        }

        return String.valueOf(arr);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "egcfe"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abcd"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "seven"\n
 * // @lcpr case=end
 * 
 */

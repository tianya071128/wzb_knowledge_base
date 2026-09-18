/*
 * @lc app=leetcode.cn id=2103 lang=java
 * @lcpr version=30204
 *
 * [2103] 环和杆
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashSet;
import java.util.Set;

class Solution {
    public int countPoints(String rings) {
        int ans = 0;
        Set<Character>[] hashList = new Set[10];

        for (int i = 1; i < rings.length(); i += 2) {
            int j = rings.charAt(i) - '0';

            if (hashList[j] == null)
                hashList[j] = new HashSet<>();

            hashList[j].add(rings.charAt(i - 1));
        }

        for (Set<Character> set : hashList) {
            if (set != null && set.size() == 3)
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "B0B6G0R6R0R6G9"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "B0R0G0R9R0B0G0"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "G4"\n
 * // @lcpr case=end
 * 
 */

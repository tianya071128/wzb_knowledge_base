/*
 * @lc app=leetcode.cn id=2558 lang=java
 * @lcpr version=30204
 *
 * [2558] 从数量最多的堆取走礼物
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;

class Solution {
    public long pickGifts(int[] gifts, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        maxHeap.addAll(Arrays.stream(gifts).boxed().toList());

        for (int i = 1; i <= k; i++) {
            Integer cur = maxHeap.poll();

            maxHeap.offer((int) Math.sqrt(cur));
        }

        return maxHeap.stream().mapToLong(Integer::intValue).sum();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [25,64,9,4,100]\n4\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,1,1,1]\n4\n
 * // @lcpr case=end
 * 
 */

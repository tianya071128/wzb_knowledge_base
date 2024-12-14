/*
 * @lc app=leetcode.cn id=31 lang=javascript
 * @lcpr version=30204
 *
 * [31] 下一个排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
  if (nums.length === 1) return nums;
  /**
   * 解题: 这道题的描述看不懂, 在题目评论中找到一个描述更清楚地
   *
   *  找出这个数组排序出的所有数中，刚好比当前数大的那个数
   *    比如当前 nums = [1,2,3]。这个数是123，找出1，2，3这3个数字排序可能的所有数，排序后，比123大的那个数 也就是132
   *    如果当前 nums = [3,2,1]。这就是1，2，3所有排序中最大的那个数，那么就返回1，2，3排序后所有数中最小的那个，也就是1，2，3 -> [1,2,3]
   */

  /**
   * 解题:
   *  1. 后序遍历, 并且记录下遍历过的最大值
   *      1.1 如果碰到已经确定的最大值比当前位置要大
   *           那么从当前位置的下一个开始遍历, 找到比当前位置大并且最接近的数，交换两者位置并且退出遍历
   *      1.2 否则, 就更新最大值
   *  2. 将上面交换位置的索引(如果没有交换过, 那么就会整个数组), 之后的元素排序
   */
  let i = nums.length - 2,
    max = nums[i + 1];
  for (; i >= 0; i--) {
    const n1 = nums[i];
    // 如果已经确定的最大值比当前位置要大
    if (n1 < max) {
      let exchangeIndex,
        diff = Infinity;
      // 那么从当前位置的下一个开始遍历, 找到比当前位置大并且最接近的数
      for (let j = i + 1; j < nums.length; j++) {
        const diff2 = nums[j] - n1;
        if (diff2 > 0 && diff2 < diff) {
          exchangeIndex = j;
          diff = diff2;
        }
      }

      // 找到之后, 交换两者的位置, 并且退出
      nums[i] = nums[exchangeIndex];
      nums[exchangeIndex] = n1;
      break;
    }
    // 否则的话, 那么就更新最大值
    else if (n1 > max) {
      max = n1;
    }
  }

  // 将上面交换位置的索引, 之后的元素排序
  nums.splice(
    i + 1,
    nums.length - 1 - i,
    ...nums.slice(i + 1, nums.length).sort((a, b) => a - b)
  );
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = nextPermutation;
// @lcpr-after-debug-end

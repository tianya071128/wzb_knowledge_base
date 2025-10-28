/*
 * @lc app=leetcode.cn id=969 lang=javascript
 * @lcpr version=30204
 *
 * [969] 煎饼排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var pancakeSort = function (arr) {
  /**
   * 思路: 将最大的值翻转到最后
   *  - 将最大值翻转到头位
   *  - 将头位翻转到末位
   */
  let ans = [];

  function reverse(i) {
    let left = 0,
      right = i;

    while (right > left) {
      [arr[left], arr[right]] = [arr[right], arr[left]];

      right--;
      left++;
    }
  }

  // 外层为还剩多少元素未翻转
  for (let i = arr.length - 1; i >= 0; i--) {
    // 内层确定元素的最大值索引
    let maxIndex = 0;
    for (let j = 1; j <= i; j++) {
      maxIndex = arr[j] > arr[maxIndex] ? j : maxIndex;
    }

    if (maxIndex !== i) {
      // 将最大值翻转到头位
      reverse(maxIndex);
      // 将头位翻转到末位
      reverse(i);

      ans.push(maxIndex + 1);
      ans.push(i + 1);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,4,1]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1]\n
// @lcpr case=end

 */

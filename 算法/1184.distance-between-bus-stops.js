/*
 * @lc app=leetcode.cn id=1184 lang=javascript
 * @lcpr version=30204
 *
 * [1184] 公交站间的距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} distance
 * @param {number} start
 * @param {number} destination
 * @return {number}
 */
var distanceBetweenBusStops = function (distance, start, destination) {
  if (start === destination) return 0;

  let len = distance.length;

  // 正序
  let n = 0,
    i = start;
  while (i !== destination) {
    n += distance[i];

    i = (i + 1) % len;
  }

  // 倒序
  let n2 = 0,
    j = start;
  while (j !== destination) {
    j = j === 0 ? len - 1 : j - 1;

    n2 += distance[j];
  }

  return Math.min(n, n2);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n0\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n0\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n0\n3\n
// @lcpr case=end

 */

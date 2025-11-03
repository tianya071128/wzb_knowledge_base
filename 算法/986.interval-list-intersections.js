/*
 * @lc app=leetcode.cn id=986 lang=javascript
 * @lcpr version=30204
 *
 * [986] 区间列表的交集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} firstList
 * @param {number[][]} secondList
 * @return {number[][]}
 */
var intervalIntersection = function (firstList, secondList) {
  /**
   * 双指针
   */
  let ans = [],
    first = 0,
    second = 0;

  while (first < firstList.length && second < secondList.length) {
    while (first < firstList.length) {
      if (
        Math.max(firstList[first][0], secondList[second][0]) <=
        Math.min(firstList[first][1], secondList[second][1])
      ) {
        ans.push([
          Math.max(firstList[first][0], secondList[second][0]),
          Math.min(firstList[first][1], secondList[second][1]),
        ]);
      }

      // 继续下一块尝试
      if (firstList[first][1] < secondList[second][1]) {
        first++;
      } else {
        break;
      }
    }

    second++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,2],[5,10],[13,23],[24,25]]\n[[1,5],[8,12],[15,24],[25,26]]\n
// @lcpr case=end

// @lcpr case=start
// [[3,5],[9,20]]\n[[4,5],[7,10],[11,12],[14,15],[16,20]]\n
// @lcpr case=end

// @lcpr case=start
// []\n[[4,8],[10,12]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,7]]\n[[3,10]]\n
// @lcpr case=end

 */

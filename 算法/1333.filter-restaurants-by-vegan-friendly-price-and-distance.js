/*
 * @lc app=leetcode.cn id=1333 lang=javascript
 * @lcpr version=30204
 *
 * [1333] 餐厅过滤器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} restaurants
 * @param {number} veganFriendly
 * @param {number} maxPrice
 * @param {number} maxDistance
 * @return {number[]}
 */
var filterRestaurants = function (
  restaurants,
  veganFriendly,
  maxPrice,
  maxDistance
) {
  return restaurants
    .filter((restaurantItem) => {
      // veganFriendly 过滤
      if (veganFriendly === 1 && restaurantItem[2] === 0) return false;

      // 价格过滤
      if (restaurantItem[3] > maxPrice) return false;

      // 距离过滤
      if (restaurantItem[4] > maxDistance) return false;

      return true;
    })
    .sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1];

      return b[0] - a[0];
    })
    .map((item) => item[0]);
};
// @lc code=end

/*
// @lcpr case=start
// [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n1\n50\n10\n
// @lcpr case=end

// @lcpr case=start
// [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n0\n50\n10\n
// @lcpr case=end

// @lcpr case=start
// [[1,4,1,40,10],[2,8,0,50,5],[3,8,1,30,4],[4,10,0,10,3],[5,1,1,15,1]]\n0\n30\n3\n
// @lcpr case=end

 */

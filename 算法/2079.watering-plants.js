/*
 * @lc app=leetcode.cn id=2079 lang=javascript
 * @lcpr version=30204
 *
 * [2079] 给植物浇水
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} plants
 * @param {number} capacity
 * @return {number}
 */
var wateringPlants = function (plants, capacity) {
  let ans = 0,
    cur = capacity;

  for (let i = 0; i < plants.length; i++) {
    // 如果不能浇灌, 那么就需要返回加水
    if (cur < plants[i]) {
      cur = capacity;
      ans += i * 2;
    }

    cur -= plants[i];
  }

  return ans + plants.length;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=wateringPlants
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [2,2,3,3]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,4,2,3]\n4\n
// @lcpr case=end

// @lcpr case=start
// [7,7,7,7,7,7,7]\n8\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = wateringPlants;
// @lcpr-after-debug-end

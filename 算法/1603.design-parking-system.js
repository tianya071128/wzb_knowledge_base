/*
 * @lc app=leetcode.cn id=1603 lang=javascript
 * @lcpr version=30204
 *
 * [1603] 设计停车系统
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} big
 * @param {number} medium
 * @param {number} small
 */
var ParkingSystem = function (big, medium, small) {
  this.size = [big, medium, small];
};

/**
 * @param {number} carType
 * @return {boolean}
 */
ParkingSystem.prototype.addCar = function (carType) {
  if (this.size[carType - 1] === 0) return false;

  this.size[carType - 1]--;

  return true;
};

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * var obj = new ParkingSystem(big, medium, small)
 * var param_1 = obj.addCar(carType)
 */
// @lc code=end

/*
// @lcpr case=start
// ["ParkingSystem", "addCar", "addCar", "addCar", "addCar"]\n[[1, 1, 0], [1], [2], [3], [1]]\n
// @lcpr case=end

 */

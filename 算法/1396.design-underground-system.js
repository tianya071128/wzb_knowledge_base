/*
 * @lc app=leetcode.cn id=1396 lang=javascript
 * @lcpr version=30204
 *
 * [1396] 设计地铁系统
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var UndergroundSystem = function () {
  /** @type {Map<number, [string, number]>} Map<id, [车站, 时间]> */
  this.checkInMap = new Map();
  /** @type {Map<string, [number, number]>} Map<startStation -> endStation, [总和, 个数]> */
  this.averageTimeMap = new Map();
};

/**
 * @param {number} id
 * @param {string} stationName
 * @param {number} t
 * @return {void}
 */
UndergroundSystem.prototype.checkIn = function (id, stationName, t) {
  this.checkInMap.set(id, [stationName, t]);
};

/**
 * @param {number} id
 * @param {string} stationName
 * @param {number} t
 * @return {void}
 */
UndergroundSystem.prototype.checkOut = function (id, stationName, t) {
  // 获取进站的信息
  let inStation = this.checkInMap.get(id),
    key = `${inStation[0]} -> ${stationName}`,
    time = t - inStation[1],
    ans = this.averageTimeMap.get(key) ?? [0, 0];

  ans[0] += time;
  ans[1]++;

  if (!this.averageTimeMap.has(key)) this.averageTimeMap.set(key, ans);
};

/**
 * @param {string} startStation
 * @param {string} endStation
 * @return {number}
 */
UndergroundSystem.prototype.getAverageTime = function (
  startStation,
  endStation
) {
  let ans = this.averageTimeMap.get(`${startStation} -> ${endStation}`);

  return ans[0] / ans[1];
};

/**
 * Your UndergroundSystem object will be instantiated and called as such:
 * var obj = new UndergroundSystem()
 * obj.checkIn(id,stationName,t)
 * obj.checkOut(id,stationName,t)
 * var param_3 = obj.getAverageTime(startStation,endStation)
 */
// @lc code=end

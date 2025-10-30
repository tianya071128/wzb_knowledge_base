/*
 * @lc app=leetcode.cn id=981 lang=javascript
 * @lcpr version=30204
 *
 * [981] 基于时间的键值存储
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var TimeMap = function () {
  /**
   * 提供两个 Map 来存储
   *  - 键值Map
   *  - 键时间戳Map
   */
  this.valueMap = new Map();
  this.timestampMap = new Map();
};

/**
 * @param {string} key
 * @param {string} value
 * @param {number} timestamp
 * @return {void}
 */
TimeMap.prototype.set = function (key, value, timestamp) {
  // 因为 set 操作中的时间戳 timestamp 都是严格递增的，所以直接追加到尾部即可
  if (!this.valueMap.has(key)) {
    this.valueMap.set(key, [value]);
    this.timestampMap.set(key, [timestamp]);
  } else {
    this.valueMap.get(key).push(value);
    this.timestampMap.get(key).push(timestamp);
  }
};

/**
 * @param {string} key
 * @param {number} timestamp
 * @return {string}
 */
TimeMap.prototype.get = function (key, timestamp) {
  if (!this.timestampMap.has(key)) return '';

  // 二分查找 timestamps, 找到最接近 timestamp 的值
  let timestamps = this.timestampMap.get(key),
    l = 0,
    r = timestamps.length - 1;

  while (l < r) {
    let mid = l + Math.ceil((r - l) / 2);

    if (timestamps[mid] === timestamp) {
      l = mid;
      // 找到结果, 直接退出
      break;
    }
    // 在左区间
    else if (timestamps[mid] > timestamp) {
      r = mid - 1;
    }
    // 在右区间
    else {
      l = mid;
    }
  }

  if (timestamps[l] <= timestamp) {
    return this.valueMap.get(key)[l];
  }

  return '';
};

/**
 * Your TimeMap object will be instantiated and called as such:
 * var obj = new TimeMap()
 * obj.set(key,value,timestamp)
 * var param_2 = obj.get(key,timestamp)
 */
// @lc code=end

/*
// @lcpr case=start
// ["TimeMap", "set", "get", "get", "set", "get", "get"]\n[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]\n
// @lcpr case=end

 */

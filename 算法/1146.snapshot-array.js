/*
 * @lc app=leetcode.cn id=1146 lang=javascript
 * @lcpr version=30204
 *
 * [1146] 快照数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} length
 */
var SnapshotArray = function (length) {
  this.shap_id = 0; // 快照id
  /** @type {[number, number][][]} 数组项结构: [快照id, 对应值][] */
  this.arr = Array.from({ length: length }, () => [[this.shap_id, 0]]);
};

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
SnapshotArray.prototype.set = function (index, val) {
  let ret = this.arr[index];

  // 快照没有变化的话, 直接使用
  if (ret.at(-1)?.[0] === this.shap_id) {
    ret.at(-1)[1] = val;
  }
  // 否则, 追加
  else {
    ret.push([this.shap_id, val]);
  }
};

/**
 * @return {number}
 */
SnapshotArray.prototype.snap = function () {
  this.shap_id++;

  return this.shap_id - 1;
};

/**
 * @param {number} index
 * @param {number} snap_id
 * @return {number}
 */
SnapshotArray.prototype.get = function (index, snap_id) {
  /**
   * 关键点: 我们在每个索引记录下的快照集合中, 找到第一个小于等于 snap_id 的快照项
   *
   *  二分搜索
   */
  let arr = this.arr[index],
    l = 0,
    r = arr.length - 1;

  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);

    // 在左区间
    if (arr[mid][0] > snap_id) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }

  return arr[r][1];
};

/**
 * Your SnapshotArray object will be instantiated and called as such:
 * var obj = new SnapshotArray(length)
 * obj.set(index,val)
 * var param_2 = obj.snap()
 * var param_3 = obj.get(index,snap_id)
 */
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=SnapshotArray
// paramTypes= ["string[]","number[][]"]
// @lcpr-div-debug-arg-end

const test = new SnapshotArray(4);
test.snap();
test.snap();
test.get(3, 1);
test.set(2, 4);
test.snap();
test.set(1, 4);

/*
// @lcpr case=start
// ["SnapshotArray","snap","snap","get","set","snap","set"]\n[[4],[],[],[3,1],[2,4],[],[1,4]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = SnapshotArray;
// @lcpr-after-debug-end

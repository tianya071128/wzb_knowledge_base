/*
 * @lc app=leetcode.cn id=855 lang=javascript
 * @lcpr version=30204
 *
 * [855] 考场就座
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 */
var ExamRoom = function (n) {
  /**
   * 座位号太多, 无法使用数组存储所有座位号
   *
   * 直接使用数组存储落座的座位号
   */
  this.seats = [];
  this.seatTotal = n; // 座位总数
};

/**
 * @return {number}
 */
ExamRoom.prototype.seat = function () {
  // 无人落座
  if (this.seats.length === 0) {
    this.seats.push(0);
    return 0;
  }
  // 只落座一人
  else if (this.seats.length === 1) {
    // 落座到最后
    if (this.seatTotal - 1 - this.seats[0] > this.seats[0]) {
      this.seats.push(this.seatTotal - 1);
      return this.seatTotal - 1;
    } else {
      this.seats.unshift(0);
      return 0;
    }
  }

  let distance = 0, // 距离
    seat = 0, // 座位号
    index = 0; // 插入位置

  for (let i = 0; i <= this.seats.length; i++) {
    // 两个位置之间应该落座的座位号
    let curSeat =
      i === 0 // 如果是一个落座位置
        ? 0 //  那么座位号就是开头的
        : i === this.seats.length
        ? this.seatTotal - 1 //  那么座位号就是末位的
        : this.seats[i - 1] + // 否则就是两者之间的
          Math.floor((this.seats[i] - this.seats[i - 1]) / 2);
    // 当前位置距离
    let curDistance = i === 0 ? this.seats[i] : curSeat - this.seats[i - 1];

    if (curDistance > distance) {
      seat = curSeat;
      index = i;
      distance = curDistance;
    }
  }

  this.seats.splice(index, 0, seat);

  return seat;
};

/**
 * @param {number} p
 * @return {void}
 */
ExamRoom.prototype.leave = function (p) {
  let i = this.seats.indexOf(p);
  this.seats.splice(i, 1);
};

/**
 * Your ExamRoom object will be instantiated and called as such:
 * var obj = new ExamRoom(n)
 * var param_1 = obj.seat()
 * obj.leave(p)
 */
// @lc code=end

/*
// @lcpr case=start
// ["ExamRoom", "seat", "seat", "seat", "seat", "leave", "seat"]\n[[10], [], [], [], [], [4], []]\n
// @lcpr case=end

// @lcpr case=start
// ["ExamRoom","seat","leave","seat","leave","seat","leave","seat","leave","seat","leave"]\n[[1000000000],[],[0],[],[0],[],[0],[],[0],[],[0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = ExamRoom;
// @lcpr-after-debug-end

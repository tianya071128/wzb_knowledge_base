/*
 * @lc app=leetcode.cn id=729 lang=javascript
 * @lcpr version=30204
 *
 * [729] 我的日程安排表 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var MyCalendar = function () {
  /** 有序的 */
  this.list = [];
};

/**
 * @param {number} startTime
 * @param {number} endTime
 * @return {boolean}
 */
MyCalendar.prototype.book = function (startTime, endTime) {
  let i = 0;
  for (; i < this.list.length; i++) {
    const cur = this.list[i];
    // 找下一个
    if (startTime >= cur[1]) {
      continue;
    }
    // 插入到当前项
    else if (endTime <= cur[0]) {
      break;
    }
    // 具有重叠项
    else {
      return false;
    }
  }

  this.list.splice(i, 0, [startTime, endTime]);
  return true;
};

/**
 * Your MyCalendar object will be instantiated and called as such:
 * var obj = new MyCalendar()
 * var param_1 = obj.book(startTime,endTime)
 */
// @lc code=end

/*
// @lcpr case=start
// ["MyCalendar", "book", "book", "book"]\n[[], [10, 20], [15, 25], [20, 30]]\n
// @lcpr case=end

 */

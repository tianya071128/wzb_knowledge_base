/*
 * @lc app=leetcode.cn id=155 lang=typescript
 * @lcpr version=30204
 *
 * [155] 最小栈
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class MinStack {
  list: {
    /** 当前值 */
    val: number;
    /** 当前值之前的最小值 */
    min: number;
  }[] = [];
  constructor() {}

  push(val: number): void {
    this.list.push({
      val,
      min: Math.min(val, this.list.at(-1)?.min ?? Infinity),
    });
  }

  pop(): void {
    this.list.pop();
  }

  top(): number {
    return this.list.at(-1)?.val ?? Infinity;
  }

  /**
   * 要求 O(1) 获取最小元素
   */
  getMin(): number {
    return this.list.at(-1)?.min ?? Infinity;
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
// @lc code=end

/*
// @lcpr case=start
// ["MinStack","push","push","push","getMin","pop","top","getMin"][[],[-2],[0],[-3],[],[],[],[]]\n
// @lcpr case=end

 */

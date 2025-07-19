/*
 * @lc app=leetcode.cn id=690 lang=javascript
 * @lcpr version=30204
 *
 * [690] 员工的重要性
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for Employee.
 * function Employee(id, importance, subordinates) {
 *     this.id = id;
 *     this.importance = importance;
 *     this.subordinates = subordinates;
 * }
 */

/**
 * @param {Employee[]} employees
 * @param {number} id
 * @return {number}
 */
var GetImportance = function (employees, id) {
  /**
   * 1. 先遍历一遍, 使用 hashMap 记录下相关信息
   * 2. 在使用另一个 set 记录下找过的员工, 防止成环(应该不会成环)
   * 3. 从 id 对应的员工开始, 将对应的下属推入待处理的队列
   */
  let ans = 0,
    passing = new Set(), // 记录找过的员工
    map = new Map();

  for (const item of employees) {
    map.set(item.id, item);
  }

  let queue = [map.get(id)],
    cur;

  while ((cur = queue.pop())) {
    passing.add(cur.id);
    ans += cur.importance;

    // 将下属推入到队列
    queue.push(...cur.subordinates.map((item) => map.get(item)));
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,5,[2,3]],[2,3,[]],[3,3,[]]]\n1\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,[5]],[5,-3,[]]]\n5\n
// @lcpr case=end

 */

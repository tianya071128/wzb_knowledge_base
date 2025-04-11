/*
 * @lc app=leetcode.cn id=331 lang=javascript
 * @lcpr version=30204
 *
 * [331] 验证二叉树的前序序列化
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function (preorder) {
  /**
   * 使用栈
   */
  const list = preorder.split(',');
  const stack = [];

  if (preorder === '#') return true;
  // 只有一个或者为偶数时, 直接可以判定为 false
  if (list.length < 2 || list.length % 2 === 0) return false;

  // 开始迭代, 此时初始指向的是左树
  let direction = 'left'; // 方向
  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    if (direction === 'left') {
      // 左树为入栈
      stack.push(item);

      // 当该项为 # 时, 那么下一次为 右树
      if (item === '#') direction = 'right';
    } else {
      // 右树为匹配出栈 - 如果没有匹配的, 表示不符合条件
      if (stack.length === 1) return false;

      stack.pop();

      // 当该项不为 # 时, 切换为左树
      if (item !== '#') direction = 'left';
    }
  }

  return stack.length === 1;
};
// @lc code=end

/*
// @lcpr case=start
// "9,3,4,#,#,1,#,#,2,#,6,#,#"\n
// @lcpr case=end

// @lcpr case=start
// "#"\n
// @lcpr case=end

// @lcpr case=start
// "#,#,#"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isValidSerialization;
// @lcpr-after-debug-end

/*
 * @lc app=leetcode.cn id=1300 lang=javascript
 * @lcpr version=30204
 *
 * [1300] 转变数组后最接近目标值的数组和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number}
 */
var findBestValue = function (arr, target) {
  /**
   * 1. 升序排序
   * 2. 遍历数组
   */
  arr.sort((a, b) => a - b);

  let prevSum = 0; // 指针 i 之前的数之和
  for (let i = 0; i < arr.length; i++) {
    // (target - 将指针之前的数之和) / (arr.length - i)
    let res = (target - prevSum) / (arr.length - i);

    // 本来可以四舍五入的, 但是 0.5 是要往下取整
    res = res > Math.floor(res) + 0.5 ? Math.ceil(res) : Math.floor(res);

    if (arr[i] >= res) return res;

    prevSum += arr[i];
  }

  return arr.at(-1);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=findBestValue
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [3,4,5,6]\n18\n
// @lcpr case=end

// @lcpr case=start
// [1547,83230,57084,93444,70879]\n71237\n
// @lcpr case=end

// @lcpr case=start
// [60864,25176,27249,21296,20204]\n56803\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findBestValue;
// @lcpr-after-debug-end

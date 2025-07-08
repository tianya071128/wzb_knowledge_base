/*
 * @lc app=leetcode.cn id=658 lang=javascript
 * @lcpr version=30204
 *
 * [658] 找到 K 个最接近的元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findClosestElements = function (arr, k, x) {
  if (k >= arr.length) return arr;

  // 二分搜索找到最接近 x 的值
  let left = 0,
    right = arr.length - 1;

  while (right - left > 1) {
    const mid = left + Math.floor((right - left) / 2);
    const n = arr[mid];

    // 命中返回 - 提前返回
    if (n === x) {
      left = mid;
      break;
    }
    // 右区间
    else if (x > n) {
      left = mid;
    }
    // 左区间
    else {
      right = mid;
    }
  }

  // 就在左右区间之中
  if (arr[right] - x < x - arr[left]) {
    left = right;
  }

  let ans = [arr[left]],
    l = left - 1,
    r = left + 1;
  k--;
  while (k > 0) {
    const diff1 = Math.abs((arr[l] ?? Infinity) - x);
    const diff2 = Math.abs((arr[r] ?? Infinity) - x);

    // 添加左边的
    if (diff1 <= diff2) {
      ans.unshift(arr[l]);
      l--;
    } else {
      ans.push(arr[r]);
      r++;
    }

    k--;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,4,4,4,5,5]\n3\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,3,4,5]\n4\n-1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findClosestElements;
// @lcpr-after-debug-end

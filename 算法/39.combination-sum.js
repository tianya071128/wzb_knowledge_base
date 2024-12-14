/*
 * @lc app=leetcode.cn id=39 lang=javascript
 * @lcpr version=30204
 *
 * [39] 组合总和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  let res = [];
  // 递归法 -- 参考: https://leetcode.cn/problems/combination-sum/solutions/406596/shou-hua-tu-jie-zu-he-zong-he-combination-sum-by-x/
  function dfs(i, temp, total) {
    if (total === target) {
      return res.push(temp);
    }
    // 终止条件: 总和大于目标值
    if (total > target) return;

    for (let index = i; index < candidates.length; index++) {
      const item = candidates[index];
      dfs(index, [...temp, item], total + item);
    }
  }

  // 从索引0开始
  dfs(0, [], 0);

  return res;
};
// @lc code=end

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
// var combinationSum = function (candidates, target) {
//   candidates = candidates.sort((a, b) => a - b);
//   /**
//    * 解题思路: 对于每个元素都扩散一下多次
//    */
//   /**
//    * candidate:
//    *  {
//    *    // 数据
//    *    list: number[],
//    *    // 当前总和
//    *    total: number
//    *  }
//    */
//   let candidate = [], // 候选集合
//     res = [];
//   for (const item of candidates) {
//     // 当此项都大于目标值, 也就没有比较的必要
//     if (item > target) break;

//     let candidateRes = [];

//     // 遍历候选集合
//     for (let index = 0; index < candidate.length; index++) {
//       // 尝试添加不同个该项的值, 是否存在与 target 匹配的情况
//       const candidateItem = candidate[index];

//       // 追加次数
//       let total = candidateItem.total,
//         list = [];
//       while (total <= target) {
//         // 匹配
//         if (total === target) {
//           res.push([...candidateItem.list, ...list]);
//           break;
//         }
//         // 可继续推入候选集合
//         else if (total + item < target) {
//           candidateRes.push({
//             total: total,
//             list: [...candidateItem.list, ...list],
//           });
//         }

//         // 增加变量
//         total += item;
//         list.push(item);
//       }
//     }

//     // 对于当项, 扩散追加进候选集合
//     let total = item,
//       list = [item];
//     while (total <= target) {
//       // 正好匹配
//       if (total === target) {
//         res.push(list);
//         break;
//       }
//       // 追加进候选集合
//       else if (total + item < target) {
//         candidateRes.push({
//           total: total,
//           list: [...list],
//         });
//       }

//       // 变量重置
//       total += item;
//       list.push(item);
//     }

//     candidate = candidateRes;
//   }

//   return res;
// };

/*
// @lcpr case=start
// [2,3,6,7]\n7\n
// @lcpr case=end

// @lcpr case=start
// [2,3,5]\n8\n
// @lcpr case=end

// @lcpr case=start
// [2]\n1\n
// @lcpr case=end

 */

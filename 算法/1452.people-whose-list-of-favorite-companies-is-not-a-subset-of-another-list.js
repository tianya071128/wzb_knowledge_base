/*
 * @lc app=leetcode.cn id=1452 lang=javascript
 * @lcpr version=30204
 *
 * [1452] 收藏清单
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} favoriteCompanies
 * @return {number[]}
 */
var peopleIndexes = function (favoriteCompanies) {
  // 将其组装成哈希表, 并按照数组长度排序
  favoriteCompanies = favoriteCompanies
    .map((item, index) => [new Set(item), index])
    .sort((a, b) => {
      return b[0].size - a[0].size;
    });

  let ans = [], // 首先记录下不是子集的索引
    helper = function helper(set1, set2) {
      for (const item of set1) {
        if (!set2.has(item)) return false;
      }

      return true;
    };

  for (let i = 0; i < favoriteCompanies.length; i++) {
    let cur = favoriteCompanies[i][0],
      flag = true;
    // 检测是否为其他元素的子集
    for (const j of ans) {
      if (helper(cur, favoriteCompanies[j][0])) {
        flag = false;
        break;
      }
    }

    if (flag) {
      ans.push(i);
    }
  }

  return ans.map((item) => favoriteCompanies[item][1]).sort((a, b) => a - b);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=peopleIndexes
// paramTypes= ["string[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [["leetcode","google","facebook"],["google","microsoft"],["google","facebook"],["google"],["amazon"]]\n
// @lcpr case=end

// @lcpr case=start
// [["leetcode","google","facebook"],["leetcode","amazon"],["facebook","google"]]\n
// @lcpr case=end

// @lcpr case=start
// [["nxaqhyoprhlhvhyojanr","ovqdyfqmlpxapbjwtssm","qmsbphxzmnvflrwyvxlc","udfuxjdxkxwqnqvgjjsp","yawoixzhsdkaaauramvg","zycidpyopumzgdpamnty"],["nxaqhyoprhlhvhyojanr","ovqdyfqmlpxapbjwtssm","udfuxjdxkxwqnqvgjjsp","yawoixzhsdkaaauramvg","zycidpyopumzgdpamnty"],["ovqdyfqmlpxapbjwtssm","qmsbphxzmnvflrwyvxlc","udfuxjdxkxwqnqvgjjsp","yawoixzhsdkaaauramvg","zycidpyopumzgdpamnty"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = peopleIndexes;
// @lcpr-after-debug-end

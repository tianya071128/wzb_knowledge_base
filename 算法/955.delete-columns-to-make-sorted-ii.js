/*
 * @lc app=leetcode.cn id=955 lang=javascript
 * @lcpr version=30204
 *
 * [955] 删列造序 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} strs
 * @return {number}
 */
var minDeletionSize = function (strs) {
  let ans = new Set(); // 表示删除索引

  while (ans.size <= strs[0].length) {
    for (let i = 0; i < strs.length; i++) {
      // 如果是最后一个字符, 说明已经是按字典序排列的
      if (i === strs.length - 1) return ans.size;

      // 比较前后两个字符是否按字典序升序的
      let s1 = strs[i],
        s2 = strs[i + 1],
        curDeleteIndexs = []; // 该次删除索引序列

      for (let j = 0; j < s1.length; j++) {
        // 如果已经被删除列的话, 那么就不做处理
        if (ans.has(j)) continue;

        // 如果该位置字符是降序, 那么就删除该位置
        if (s1[j] > s2[j]) {
          curDeleteIndexs.push(j);
        }
        // 如果相同的话, 那么继续比较
        else if (s1[j] === s2[j]) {
        } else {
          break;
        }
      }

      // 如果当前比较字符存在需要删除的索引序列, 那么就加入结果中, 并从头开始遍历
      if (curDeleteIndexs.length) {
        for (const i of curDeleteIndexs) {
          ans.add(i);
        }

        break;
      }
    }
  }

  return ans.size;
};
// @lc code=end

/*
// @lcpr case=start
// ["xga","xfb","yfa"]\n
// @lcpr case=end

// @lcpr case=start
// ["xc","yb","za"]\n
// @lcpr case=end

// @lcpr case=start
// ["zyx","wvu","tsr"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minDeletionSize;
// @lcpr-after-debug-end

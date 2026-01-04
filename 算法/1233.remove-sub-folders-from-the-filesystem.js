/*
 * @lc app=leetcode.cn id=1233 lang=javascript
 * @lcpr version=30204
 *
 * [1233] 删除子文件夹
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} folder
 * @return {string[]}
 */
var removeSubfolders = function (folder) {
  // 1. 首先排序, 越短的越不可能是子文件夹
  folder.sort((a, b) => a.length - b.length);

  // 2. 类似于字典树, 存储每个文件夹的名字
  const ans = [],
    hash = new Map();

  for (const item of folder) {
    let arr = item.slice(1).split('/'),
      flag = false, // 是否为子文件夹
      curMap = hash; // 起始 map
    // 为每个文件夹建立 Map
    for (const name of arr) {
      let prevMap = curMap.get(name);

      // 当存在并且没有元素为空时, 说明是终点, 那么此时 item 为子文件夹
      if (prevMap && !prevMap.size) {
        flag = true;
        break;
      }

      // 继续增加链路
      if (!prevMap) {
        prevMap = new Map();
        curMap.set(name, prevMap);
      }

      curMap = prevMap;
    }

    if (!flag) ans.push(item);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=removeSubfolders
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["/a","/a/b","/c/d","/c/d/e","/c/f"]\n
// @lcpr case=end

// @lcpr case=start
// ["/a","/a/b/c","/a/b/d"]\n
// @lcpr case=end

// @lcpr case=start
// ["/a/b/c","/a/b/ca","/a/b/d"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeSubfolders;
// @lcpr-after-debug-end

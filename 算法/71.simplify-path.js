/*
 * @lc app=leetcode.cn id=71 lang=javascript
 * @lcpr version=30204
 *
 * [71] 简化路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function (path) {
  // 转为数组
  let list = path.split('/'),
    res = [];

  // 反向遍历数组, 依次解析
  let prve = 0; // 切换到上一级的次数
  for (let i = list.length - 1; i > -1; i--) {
    const item = list[i];

    // 1. 一个点 '.' 表示当前目录本身
    // 不处理
    if (item === '.') {
      continue;
    }
    // 两个点 '..' 表示将目录切换到上一级（指向父目录）。
    else if (item === '..') {
      prve++;
    }
    // 任意多个连续的斜杠（即，'//' 或 '///'）都被视为单个斜杠 '/'。
    // 标识为空字符串
    else if (item === '') {
      continue;
    }
    // 其他都视为有效的文件/目录名称
    else {
      if (prve !== 0) {
        prve--;
        continue;
      } else {
        res.unshift(item);
      }
    }
  }

  return '/' + res.join('/');
};
// @lc code=end

/*
// @lcpr case=start
// "/home/"\n
// @lcpr case=end

// @lcpr case=start
// "/home//foo/"\n
// @lcpr case=end

// @lcpr case=start
// "/home/user/Documents/../Pictures"\n
// @lcpr case=end

// @lcpr case=start
// "/../"\n
// @lcpr case=end

// @lcpr case=start
// "/.../a/../b/c/../d/./"\n
// @lcpr case=end

 */

/*
 * @lc app=leetcode.cn id=388 lang=javascript
 * @lcpr version=30204
 *
 * [388] 文件的最长绝对路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} input
 * @return {number}
 */
var lengthLongestPath = function (input) {
  let ans = 0,
    stack = []; // 路径栈

  // 先根据 \n 分割
  for (const item of input.split('\n')) {
    // 再根据 \t 分割
    const res = item.split('\t');
    const name = res.pop(); // 删除最后一项, 此为目录名或者文件名

    // 根据 \t 个数来判断 stack 保留几个
    stack = stack.slice(0, res.length);
    stack.push(name);

    // 如果是文件的话
    if (name.includes('.')) {
      ans = Math.max(ans, stack.join('/').length);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"\n
// @lcpr case=end

// @lcpr case=start
// "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n
// @lcpr case=end

// @lcpr case=start
// "file1.txt\nfile2.txt\nlongfile.txt"\n
// @lcpr case=end

 */

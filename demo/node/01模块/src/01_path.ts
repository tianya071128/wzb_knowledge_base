import path from 'node:path';

// #region ------------ basename(path[, suffix]): 返回 path 的最后一部分 ------------

console.log(path.basename('/foo/bar/baz/asdf/quux.html')); // quux.html

// #endregion

// #region ------------ dirname(path): 返回 path 的目录名 ------------

console.log(path.dirname('https://nodejs.cn/api/path.html')); // 'https://nodejs.cn/api'

// #endregion

// #region ------------ extname(path): path 的扩展名 ------------
// path 的最后一部分中从最后一次出现的 .（句点）字符到字符串的结尾
console.log(path.extname('https://nodejs.cn/api/path.html')); // .html
console.log(path.extname('https://nodejs.cn/api/path.d.ts')); // .ts ---> 无法识别带有两个 . 的文件扩展名

// #endregion

// #region ------------ format(pathObject): 从对象返回路径字符串 ------------
console.log(
  path.format({
    dir: '/node/01模块',
    base: 'file.txt',
  })
); // /node/01模块\file.txt

console.log(
  path.format({
    dir: 'C:\\path\\dir',
    base: 'file.txt',
  })
); // C:\path\dir\file.txt ---> 会规范为当前平台的路径
// #endregion

// #region ------------ join([...paths]): 连接 path 片段,  ------------
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')); // \foo\bar\baz\asdf

// #endregion

// #region ------------ normalize(path): 规范化给定的 path ------------
console.log(path.normalize('/foo/bar//baz/asdf/quux/..')); // \foo\bar\baz\asdf
// #endregion

// #region ------------ parse(path): 解析路径 ------------
// {
//   root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
console.log(path.parse('/home/user/dir/file.txt'));

// {
//   root: '',
//   dir: 'https://nodejs.cn/api',
//   base: 'path.html',
//   ext: '.html',
//   name: 'path'
// }
console.log(path.parse('https://nodejs.cn/api/path.html'));
// #endregion

// #region ------------ resolve([...paths]): 将路径或路径片段的序列解析为绝对路径 ------------
// D:\tmp\file --> 从右到左处理，每个后续的 path 会被追加到前面，直到构建绝对路径
console.log(path.resolve('/foo/bar', '/tmp/file/'));
// 如果在处理完所有给定的 path 片段之后，还没有生成绝对路径，则使用当前工作目录。
// D:\学习\wzb_knowledge_base\demo\node\01模块\wwwroot\static_files\gif\image.gif
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'));
// #endregion

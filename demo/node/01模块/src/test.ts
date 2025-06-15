import path from 'node:path';

// 普通路径（受 MAX_PATH 限制）
const normalPath = 'C:\\very\\long\\path\\'.repeat(50) + 'file.txt';

// 转换为命名空间路径（突破 MAX_PATH 限制）
const namespacedPath = path.toNamespacedPath(normalPath);
console.log(namespacedPath);
// 在 Windows 上输出: \\?\C:\very\long\path\...\file.txt

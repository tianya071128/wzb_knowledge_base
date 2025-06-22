import { pathToFileURL } from 'node:url';

const filePath = '/home/user/../docs/file.txt';
const fileUrl = pathToFileURL(filePath);

console.log(fileUrl.href); // 输出: file:///D:/home/docs/file.txt（已规范化）

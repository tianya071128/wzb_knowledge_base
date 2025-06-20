const url = new URL('https://example.com');

// 修改 href
url.href = 'http://api.example.com:8080/path?query=1#hash';

console.log(url.protocol); // 输出: http:
console.log(url.hostname); // 输出: api.example.com
console.log(url.port); // 输出: 8080

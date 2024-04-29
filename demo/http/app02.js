//导入httpmok
const http = require('http');

//创建服务对象
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Length': 10 });
  response.end('Hello HTTP Server'); //设置响应体，结束响应
});

//监听端口，启动服务
server.listen(9000, () => {
  //服务启动成功
  console.log('服务已启动');
});

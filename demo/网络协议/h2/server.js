const http2 = require('http2');
const fs = require('fs');

// 加载我们生成的证书
const server = http2.createSecureServer({
  key: fs.readFileSync('../certificate/server.key'),
  cert: fs.readFileSync('../certificate/server.cert'),
  // minVersion: 'TLSv1.2',
  // maxVersion: 'TLSv1.2',
});

// 监听请求
server.on('stream', (stream, headers) => {
  // 输出请求头
  // console.log('请求头:', headers);

  // 响应状态 200
  stream.respond({
    'content-type': 'text/html',
    ':status': 200,
  });

  // 返回内容
  stream.end('<h1>Hello HTTP/2 🔥</h1>');

  // stream.session.close();
});

// 启动在 8443 端口
server.listen(8443, () => {
  console.log('HTTP/2 服务启动：https://localhost:8443');
});

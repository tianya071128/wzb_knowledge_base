const net = require('node:net');
const server = net.createServer((c) => {
  c.on('data', function (data) {
    console.log(data);
    c.write('你好');
  });
  // console.log(c);
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});

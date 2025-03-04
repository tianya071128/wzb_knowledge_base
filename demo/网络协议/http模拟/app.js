import EventEmitter from 'node:events';
import net from 'node:net';

// #region ------------ 核心解析器 ------------
class HTTPParser extends EventEmitter {
  constructor() {
    super();
    this.buffer = ''; // 接受到的数据
    this.state = 'REQUEST_LINE'; // 当前状态
    this.currentRequest = null; // 当前请求对象
  }

  /** 当接收到了新数据时, 启动处理 */
  feed(data) {
    this.buffer += data;
    while (this.process()) {}
  }

  /** 启动处理流程 */
  process() {
    switch (this.state) {
      // 处理请求行
      case 'REQUEST_LINE':
        return this.parseRequestLine();
      // 处理请求头
      case 'HEADERS':
        return this.parseHeaders();
      // 处理请求体
      case 'BODY':
        return this.parseBody();
      default:
        return false;
    }
  }

  /** 处理请求行 */
  parseRequestLine() {
    const lineEnd = this.buffer.indexOf('\r\n'); // 以 \r\n 结束
    if (lineEnd === -1) return false; // 找到了

    const line = this.buffer.slice(0, lineEnd);
    const [method, url, protocol] = line.split(' ');
    this.currentRequest = { method, url, protocol, headers: {}, body: '' };
    this.buffer = this.buffer.slice(lineEnd + 2); // 截断已经处理好了的数据
    this.state = 'HEADERS'; // 变更为下个状态
    return true; // 返回 true, 以继续处理
  }

  /** 处理请求头 */
  parseHeaders() {
    const lineEnd = this.buffer.indexOf('\r\n'); // 以 \r\n 结束
    if (lineEnd === -1) return false;

    // 空行表示头部结束
    const line = this.buffer.slice(0, lineEnd);
    if (line === '') {
      this.state = 'BODY';
      this.buffer = this.buffer.slice(2); // 去除最后一个 \r\n
      this.emit('headersComplete', this.currentRequest); // 发送请求头, 解析完毕事件
      return true;
    }

    const [name, value] = line.split(': ');
    this.currentRequest.headers[name.toLowerCase()] = value;
    this.buffer = this.buffer.slice(lineEnd + 2);
    return true;
  }

  /** 处理请求体 */
  parseBody() {
    // 使用 content-length 判断请求体
    const contentLength =
      parseInt(this.currentRequest.headers['content-length'], 10) || 0;
    if (this.buffer.length < contentLength) return false;

    this.currentRequest.body = this.buffer.slice(0, contentLength);
    this.buffer = this.buffer.slice(contentLength);
    this.emit('request', this.currentRequest);
    this.currentRequest = null; // 置为 null, 开启下一个 请求解析
    this.state = 'REQUEST_LINE';
    return true;
  }
}

// #endregion

// #region ------------ 服务器 ------------
// 处理请求
class HTTPServer extends EventEmitter {
  constructor() {
    super();
    this.server = net.createServer((socket) => this.handleConnection(socket));
  }

  handleConnection(socket) {
    // 创建一个请求解析器
    const parser = new HTTPParser();
    // 该连接是否被关闭
    let isConnectionClosed = false;

    // 请求解析
    parser.on('request', (req) => {
      const res = new ServerResponse(socket, req);
      this.emit('request', req, res);
    });

    // 数据接收, 传递给解析器
    socket.on('data', (data) => {
      console.log(data.toString());
      if (isConnectionClosed) return;
      parser.feed(data.toString());
    });

    // 发生错误时, 处理
    socket.on('error', (err) => {
      isConnectionClosed = true;
      this.emit('clientError', err, socket);
    });

    // 连接关闭
    socket.on('end', () => (isConnectionClosed = true));
  }

  // 监听端口
  listen(port, callback) {
    this.server.listen(port, callback);
  }
}
// 处理响应
class ServerResponse {
  constructor(socket, req) {
    this.socket = socket; // 套接字
    this.req = req;
    this.headersSent = false;
    this.headers = { Connection: 'keep-alive' }; // 先配置一个头字段
  }

  // 设置头字段
  setHeader(name, value) {
    this.headers[name.toLowerCase()] = value;
  }

  // 写入响应头
  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    Object.assign(this.headers, headers);
  }

  // 发送响应
  end(body = '') {
    if (this.headersSent) return;
    this.headersSent = true; // 不能重复发送

    const headers = { ...this.headers };
    headers['content-length'] = Buffer.byteLength(body); // 计算大小

    // 持久连接管理
    if (this.req.headers.connection === 'close' || this.statusCode >= 400) {
      headers.connection = 'close';
    }

    // 配置响应报文
    const response = [
      `HTTP/1.1 ${this.statusCode || 200} OK`,
      ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
      '',
      body,
    ].join('\r\n');

    // 发送数据
    this.socket.write(response);
    if (headers.connection === 'close') {
      this.socket.end(); // 关闭该次连接
    }
  }
}
// #endregion

// #region ------------ 使用示例 ------------
const server = new HTTPServer();

server.on('request', (req, res) => {
  // 校验 Content-Length 防御
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (req.body.length !== contentLength) {
    res.writeHead(400);
    return res.end('Invalid Content-Length');
  }

  // 正常响应
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Echo: ${req.body}`);
});

server.listen(8124, () => {
  console.log('运行在 http://localhost:8124');
});

// #endregion

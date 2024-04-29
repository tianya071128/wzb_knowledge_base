const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');

const app = new Koa();

// 服务静态文件
app.use(static(__dirname + '/public'));

const router = new Router();
// 定义getBooks接口
router.get('/getBooks', (ctx, next) => {
  const books = [{ label: '语文' }, { label: '英文' }];
  ctx.type = 'application/json';
  ctx.set('Content-Length', 20);
  ctx.body = { data: books, msg: 'success' };
});

// 将路由中间件添加到Koa应用中
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器并监听端口
app.listen(3000, () => {
  console.log('服务器正在监听端口 3000');
});

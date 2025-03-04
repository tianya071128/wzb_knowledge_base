const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// #region ------------ 路由 ------------
router.get('/', async (ctx) => {
  ctx.body = 'Home Page';
});
// #endregion

app.use(router.routes());

/** 配置 */
app.keepAliveTimeout = 30 * 1000; // 保持 TCP 连接 30 秒

// 启动服务
const port = 8124;
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});

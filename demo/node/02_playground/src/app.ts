import Koa from 'koa';
import koaStatic from 'koa-static';
import { join, normalize, relative } from 'node:path';

const app = new Koa();

// #region ------------ 静态资源托管 ------------
// 配置静态资源目录（绝对路径）
const staticDir = join(__dirname, '../public');
// 挂载静态资源中间件（优先于路由，确保先处理静态资源请求）
app.use(
  koaStatic(staticDir, {
    setHeaders(res, path) {
      const relativePath = relative(staticDir, path);

      // 规范化路径
      const normlizedPath = normalize(relativePath);
      if (normlizedPath.startsWith(normalize('assets/'))) {
        // 设置缓存时间
        res.setHeader('Cache-Control', 'max-age=31536000');
      } else {
        // 默认缓存时间 - 不缓存
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    },
  })
);
// #endregion

app.use(async (ctx) => {
  ctx.cookies.set('name', 'koa');
  ctx.body = 'Hello World';
  console.log(2);
});

app.listen(3000);

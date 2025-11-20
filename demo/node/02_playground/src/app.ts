import Koa from 'koa';
import koaStatic from 'koa-static';
import bodyParser from '@koa/bodyparser';
import { join, normalize, relative } from 'node:path';
import * as z from 'zod';
import { zhCN } from 'zod/locales';
import authRoutes from './routes/auth.route';
import responseMiddleware from './middleware/response';
import './utils/redis';
import './utils/redisPersist';

const app = new Koa();

z.config(zhCN());

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

// #region ------------ 解析请求体 ------------
// 挂载请求体解析中间件（必须在路由前）
app.use(bodyParser());
// #endregion

// #region ------------ 自定义中间件 ------------
// 挂载响应中间件（必须在路由前）
app.use(responseMiddleware);
// #endregion

// #region ------------ 路由注册 ------------
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
// #endregion

app.listen(3000);

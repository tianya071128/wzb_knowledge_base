/**
 * 权限相关的路由: 仅定义 URL、请求方法、绑定控制器，可挂载模块专属中间件。
 */
import Router from '@koa/router';
import getDictListPageController from '../../controllers/system/dict/getDictListPageController';
import { getLoginUserInfoMiddleware } from '../../middleware/getLoginUserInfo';
import addDictController, {
  AddDictSchema,
} from '../../controllers/system/dict/addDictController';
import { validateBodyMiddleware } from '../../middleware/validate';

const router = new Router({ prefix: '/alicorn-system' });

/**
 * 分页获取字典列表
 */
router.post(
  '/dict/listPage',
  getLoginUserInfoMiddleware(),
  getDictListPageController
);

/**
 * 新增字典
 */
router.post(
  '/dict/add',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(AddDictSchema),
  addDictController
);

export default router;

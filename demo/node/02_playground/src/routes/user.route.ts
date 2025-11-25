import Router from '@koa/router';
import registerController, {
  SegisterSchema,
} from '../controllers/user/registerController';
import { validateBodyMiddleware } from '../middleware/validate';
import { getLoginUserInfoMiddleware } from '../middleware/getLoginUserInfo';
import getLoginUserInfoController from '../controllers/user/getLoginUserInfoController';

const router = new Router({ prefix: '/alicorn-system' });

/**
 * 注册
 */
router.post(
  '/user/register',
  validateBodyMiddleware(SegisterSchema),
  registerController
);

/**
 * 获取用户信息
 */
router.get(
  '/user/getLoginUserInfo',
  getLoginUserInfoMiddleware(),
  getLoginUserInfoController
);

export default router;

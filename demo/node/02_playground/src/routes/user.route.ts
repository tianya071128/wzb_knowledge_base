import Router from '@koa/router';
import registerController, {
  SegisterSchema,
} from '../controllers/user/registerController';
import { validateBodyMiddleware } from '../middleware/validate';

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
// router.get('user/getLoginUserInfo', );

export default router;

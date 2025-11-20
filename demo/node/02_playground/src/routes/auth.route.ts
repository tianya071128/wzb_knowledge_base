/**
 * 权限相关的路由: 仅定义 URL、请求方法、绑定控制器，可挂载模块专属中间件。
 */
import Router from '@koa/router';
import getConfigController from '../controllers/auth/getConfigController';
import getVerifyCodeController from '../controllers/auth/getVerifyCodeController';
import checkVerifyCodeController, {
  CheckVerifyCodeSchema,
} from '../controllers/auth/checkVerifyCodeController';
import { validateBodyMiddleware } from '../middleware/validate';
import loginController, {
  LoginSchema,
} from '../controllers/auth/loginController';
import getSmsCodeController, {
  GetSmsCodeSchema,
} from '../controllers/auth/getSmsCodeController';

const router = new Router({ prefix: '/alicorn-system' });

/**
 * 获取系统配置
 */
router.get('/config/get', getConfigController);

/**
 * 获取验证图片
 */
router.post('/captcha/get', getVerifyCodeController);

/**
 * 验证图片验证码
 */
router.post(
  '/captcha/check',
  validateBodyMiddleware(CheckVerifyCodeSchema),
  checkVerifyCodeController
);

/**
 * 登录接口
 */
router.post(
  '/auth/login',
  validateBodyMiddleware(LoginSchema),
  loginController
);

/**
 * 获取验证码
 */
router.post(
  '/send/smsCode',
  validateBodyMiddleware(GetSmsCodeSchema),
  getSmsCodeController
);

export default router;

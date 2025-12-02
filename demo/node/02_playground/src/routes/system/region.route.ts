import Router from '@koa/router';
import { getLoginUserInfoMiddleware } from '../../middleware/getLoginUserInfo';
import getRegionListController, {
  GetRegionListSchema,
} from '../../controllers/system/region/getRegionListController';
import addRegionController, {
  AddRegionSchema,
} from '../../controllers/system/region/addRegionController';
import { validateBodyMiddleware } from '../../middleware/validate';
import updateRegionStatusController from '../../controllers/system/region/updateRegionStatusController';

const router = new Router({ prefix: '/alicorn-system' });

/**
 * 区域管理
 */

/** 获取区域列表 */
router.post(
  '/region/list',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(GetRegionListSchema),
  getRegionListController
);

/**
 * 新增区域
 */
router.post(
  '/region/add',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(AddRegionSchema),
  addRegionController
);

/**
 * 切换状态
 */
router.post('/region/:status/:id', updateRegionStatusController);

export default router;

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
import queryRegionListController, {
  QueryRegionListSchema,
} from '../../controllers/system/region/queryRegionListController';
import deleteRegionController from '../../controllers/system/region/deleteRegionController';
import editRegionController, {
  EditRegionSchema,
} from '../../controllers/system/region/editRegionController';

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
router.post(
  '/region/enable/:id',
  getLoginUserInfoMiddleware(),
  updateRegionStatusController
);
router.post(
  '/region/disable/:id',
  getLoginUserInfoMiddleware(),
  updateRegionStatusController
);

/**
 * 根据父级id查找下级
 */
router.post(
  '/region/queryList',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(QueryRegionListSchema),
  queryRegionListController
);

/**
 * 删除区域
 */
router.post(
  '/region/delete/:id',
  getLoginUserInfoMiddleware(),
  deleteRegionController
);

/**
 * 编辑区域
 */
router.post(
  '/region/edit',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(EditRegionSchema),
  editRegionController
);

export default router;

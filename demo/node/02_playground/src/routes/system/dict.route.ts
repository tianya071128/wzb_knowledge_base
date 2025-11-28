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
import deleteDictController from '../../controllers/system/dict/deleteDictController';
import updateStatusController from '../../controllers/system/dict/updateStatusController';
import editDictController, {
  editDictSchema,
} from '../../controllers/system/dict/editDictController';
import getDictItemListPageController from '../../controllers/system/dictItem/getDictItemListPageController';
import addDictItemController from '../../controllers/system/dictItem/addDictItemController';

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

/**
 * 删除字典
 */
router.post(
  '/dict/delete/:id',
  getLoginUserInfoMiddleware(),
  deleteDictController
);

/**
 * 更新字典状态
 */
router.post(
  '/dict/updateStatus/:id',
  getLoginUserInfoMiddleware(),
  updateStatusController
);

/**
 * 编辑字典
 */
router.post(
  '/dict/edit',
  getLoginUserInfoMiddleware(),
  validateBodyMiddleware(editDictSchema),
  editDictController
);

/**
 * 分页查询字典项
 */
router.post(
  '/dictItem/listPage',
  getLoginUserInfoMiddleware(),
  getDictItemListPageController
);

/**
 * 新增字典项
 */
router.post(
  '/dictItem/add',
  getLoginUserInfoMiddleware(),
  addDictItemController
);

export default router;

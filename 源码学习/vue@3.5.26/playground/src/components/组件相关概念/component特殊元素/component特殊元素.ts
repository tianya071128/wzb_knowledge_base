/**
 * 1. 在编译阶段, 会将 vue 文件的 component 特殊元素编译为如下类型:
 *      _createBlock(
 *        _resolveDynamicComponent($setup.flag ? 'div' : 'span'),
 *        null,
 *        {
 *          default: _withCtx(() => [
 *            ...(_cache[0] ||
 *              (_cache[0] = [
 *                _createTextVNode(
 *                  'component特殊元素',
 *                  -1
 *                ),
 *              ])),
 *          ]),
 *          _: 1,
 *        }
 *      ))
 *
 *   或者组件类型切换:
 *      _createBlock(
 *        _resolveDynamicComponent(
 *          $setup.flag ? $setup.activeComponentA : $setup.activeComponentB
 *        ),
 *        null,
 *        {
 *          default: _withCtx(() => [
 *            ...(_cache[1] ||
 *              (_cache[1] = [
 *                _createTextVNode(
 *                  ' component特殊元素 ',
 *                  -1
 *                ),
 *              ])),
 *          ]),
 *          _: 1,
 *        }
 *      )),
 */

import { resolveDynamicComponent as _resolveDynamicComponent } from 'vue';
/**
 * 2. 如上图所示, 主要是调用 resolveDynamicComponent 方法返回创建的VNode类型, 详情见 resolveDynamicComponent 方法注释
 */

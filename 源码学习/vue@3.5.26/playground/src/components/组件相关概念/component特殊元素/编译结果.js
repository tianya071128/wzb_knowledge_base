import { createHotContext as __vite__createHotContext } from '/@vite/client';
import.meta.hot = __vite__createHotContext(
  '/src/components/基础/component特殊元素/ComponentDemo.vue'
);
import { defineComponent as _defineComponent } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts';
import {
  defineComponent,
  h,
  ref,
} from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts';
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'ComponentDemo',
  setup(__props, { expose: __expose }) {
    __expose();
    const flag = ref(true);
    const activeComponentA = defineComponent({
      name: 'name_a',
      setup() {
        return () => {
          return h('div', 'a');
        };
      },
    });
    const activeComponentB = defineComponent({
      name: 'name_b',
      setup() {
        return () => {
          return h('div', ['b']);
        };
      },
    });
    const __returned__ = {
      flag,
      activeComponentA,
      activeComponentB,
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true,
    });
    return __returned__;
  },
});
import {
  createTextVNode as _createTextVNode,
  resolveDynamicComponent as _resolveDynamicComponent,
  withCtx as _withCtx,
  openBlock as _openBlock,
  createBlock as _createBlock,
  createElementBlock as _createElementBlock,
} from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts';
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock('div', null, [
      (_openBlock(),
      _createBlock(
        _resolveDynamicComponent($setup.flag ? 'div' : 'span'),
        null,
        {
          default: _withCtx(() => [
            ...(_cache[0] ||
              (_cache[0] = [
                _createTextVNode(
                  'component特殊元素',
                  -1
                  /* CACHED */
                ),
              ])),
          ]),
          _: 1,
        }
      )),
      (_openBlock(),
      _createBlock(
        _resolveDynamicComponent(
          $setup.flag ? $setup.activeComponentA : $setup.activeComponentB
        ),
        null,
        {
          default: _withCtx(() => [
            ...(_cache[1] ||
              (_cache[1] = [
                _createTextVNode(
                  ' component特殊元素 ',
                  -1
                  /* CACHED */
                ),
              ])),
          ]),
          _: 1,
        }
      )),
    ])
  );
}
_sfc_main.__hmrId = 'c846bc9b';
typeof __VUE_HMR_RUNTIME__ !== 'undefined' &&
  __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file;
});
export const _rerender_only =
  __VUE_HMR_RUNTIME__.CHANGED_FILE ===
  'D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/components/基础/component特殊元素/ComponentDemo.vue';
import.meta.hot.accept((mod) => {
  if (!mod) return;
  const { default: updated, _rerender_only } = mod;
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from '/@id/__x00__plugin-vue:export-helper';
export default /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  [
    '__file',
    'D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/components/基础/component特殊元素/ComponentDemo.vue',
  ],
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsaUJBQWlCLEdBQUcsV0FBVzs7Ozs7RUFFeEMsTUFBTSxPQUFPLElBQUksS0FBSztFQUV0QixNQUFNLG1CQUFtQixnQkFBZ0I7R0FDdkMsTUFBTTtHQUNOLFFBQVE7QUFDTixpQkFBYTtBQUNYLFlBQU8sRUFBRSxPQUFPLElBQUk7OztHQUd6QixDQUFDO0VBRUYsTUFBTSxtQkFBbUIsZ0JBQWdCO0dBQ3ZDLE1BQU07R0FDTixRQUFRO0FBQ04saUJBQWE7QUFDWCxZQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQzs7O0dBRzNCLENBQUM7Ozs7Ozs7Ozs7Ozs7OztzQkFJQSxvQkFLTSw2QkFKSixhQUFnRSx5QkFBaEQsY0FBSTswQkFBZ0M7R0FBYjtHQUFhOztHQUFBOztxQkFDcEQsYUFFWSx5QkFGSSxjQUFPLDBCQUFtQix3QkFBZ0I7MEJBRTFEO0dBRjREO0dBRTVEOztHQUFBIiwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJDb21wb25lbnREZW1vLnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IHNldHVwIGxhbmc9XCJ0c1wiPlxyXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIGgsIHJlZiB9IGZyb20gJ3Z1ZSc7XHJcblxyXG5jb25zdCBmbGFnID0gcmVmKHRydWUpO1xyXG5cclxuY29uc3QgYWN0aXZlQ29tcG9uZW50QSA9IGRlZmluZUNvbXBvbmVudCh7XHJcbiAgbmFtZTogJ25hbWVfYScsXHJcbiAgc2V0dXAoKSB7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICByZXR1cm4gaCgnZGl2JywgJ2EnKTtcclxuICAgIH07XHJcbiAgfSxcclxufSk7XHJcblxyXG5jb25zdCBhY3RpdmVDb21wb25lbnRCID0gZGVmaW5lQ29tcG9uZW50KHtcclxuICBuYW1lOiAnbmFtZV9iJyxcclxuICBzZXR1cCgpIHtcclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBoKCdkaXYnLCBbJ2InXSk7XHJcbiAgICB9O1xyXG4gIH0sXHJcbn0pO1xyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2PlxyXG4gICAgPGNvbXBvbmVudCA6aXM9XCJmbGFnID8gJ2RpdicgOiAnc3BhbidcIj5jb21wb25lbnTnibnmrorlhYPntKA8L2NvbXBvbmVudD5cclxuICAgIDxjb21wb25lbnQgOmlzPVwiZmxhZyA/IGFjdGl2ZUNvbXBvbmVudEEgOiBhY3RpdmVDb21wb25lbnRCXCI+XHJcbiAgICAgIGNvbXBvbmVudOeJueauiuWFg+e0oFxyXG4gICAgPC9jb21wb25lbnQ+XHJcbiAgPC9kaXY+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c3R5bGUgbGFuZz1cInNjc3NcIiBzY29wZWQ+PC9zdHlsZT5cclxuIl0sImZpbGUiOiJEOi/lrabkuaAvd3piX2tub3dsZWRnZV9iYXNlL+a6kOeggeWtpuS5oC92dWVAMy41LjI2L3BsYXlncm91bmQvc3JjL2NvbXBvbmVudHMv5Z+656GAL2NvbXBvbmVudOeJueauiuWFg+e0oC9Db21wb25lbnREZW1vLnZ1ZSJ9

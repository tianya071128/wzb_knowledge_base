import { createHotContext as __vite__createHotContext } from '/@vite/client';
import.meta.hot = __vite__createHotContext(
  '/src/components/指令/自定义指令/CustomDirectives.vue'
);
import { defineComponent as _defineComponent } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts';
import vHighlight from '/src/components/指令/自定义指令/自定义指令.ts?t=1770170760973';
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'CustomDirectives',
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {
      get vHighlight() {
        return vHighlight;
      },
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
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
  withDirectives as _withDirectives,
} from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts';
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _withDirectives(
    (_openBlock(),
    _createElementBlock('div', null, [
      ...(_cache[0] ||
        (_cache[0] = [
          _createTextVNode(
            '指令',
            -1
            /* CACHED */
          ),
        ])),
    ])),
    [[$setup['vHighlight']]]
  );
}
_sfc_main.__hmrId = 'd8b5b12a';
typeof __VUE_HMR_RUNTIME__ !== 'undefined' &&
  __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file;
});
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
    'D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/components/指令/自定义指令/CustomDirectives.vue',
  ],
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sZ0JBQWdCOzs7Ozs7Ozs7Ozs7Ozs7Ozt1Q0FJckIsb0JBQXlCO0VBQVI7RUFBRTs7RUFBQSIsIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQ3VzdG9tRGlyZWN0aXZlcy52dWUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cclxuaW1wb3J0IHZIaWdobGlnaHQgZnJvbSAnLi/oh6rlrprkuYnmjIfku6QudHMnO1xyXG48L3NjcmlwdD5cclxuXHJcbjx0ZW1wbGF0ZT5cclxuICA8ZGl2IHYtaGlnaGxpZ2h0PuaMh+S7pDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCIgc2NvcGVkPjwvc3R5bGU+XHJcbiJdLCJmaWxlIjoiRDov5a2m5LmgL3d6Yl9rbm93bGVkZ2VfYmFzZS/mupDnoIHlrabkuaAvdnVlQDMuNS4yNi9wbGF5Z3JvdW5kL3NyYy9jb21wb25lbnRzL+aMh+S7pC/oh6rlrprkuYnmjIfku6QvQ3VzdG9tRGlyZWN0aXZlcy52dWUifQ==

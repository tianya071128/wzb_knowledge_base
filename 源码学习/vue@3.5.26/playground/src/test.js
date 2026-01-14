import { createHotContext as __vite__createHotContext } from '/@vite/client';
import.meta.hot = __vite__createHotContext('/src/App.vue');
import { defineComponent as _defineComponent } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1768377158325';
import { ref } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1768377158325';
import HelloWorld from '/src/components/HelloWorld.vue?t=1768377158325';
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'App',
  setup(__props, { expose: __expose }) {
    __expose();
    const handleClick = () => {
      console.log('click');
    };
    const msg = ref('Hello World');
    const __returned__ = {
      handleClick,
      msg,
      HelloWorld,
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true,
    });
    return __returned__;
  },
});
import {
  createElementVNode as _createElementVNode,
  withCtx as _withCtx,
  createVNode as _createVNode,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1768377158325';
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock('div', null, [
      _createVNode(
        $setup['HelloWorld'],
        { msg: $setup.msg },
        {
          default: _withCtx(() => [
            ...(_cache[0] ||
              (_cache[0] = [
                _createElementVNode(
                  'div',
                  null,
                  '插槽',
                  -1
                  /* CACHED */
                ),
              ])),
          ]),
          _: 1,
        },
        8,
        ['msg']
      ),
    ])
  );
}
import '/src/App.vue?vue&type=style&index=0&scoped=7a7a37b1&lang.css';
_sfc_main.__hmrId = '7a7a37b1';
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
  ['__scopeId', 'data-v-7a7a37b1'],
  [
    '__file',
    'D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/App.vue',
  ],
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsV0FBVztBQUNwQixPQUFPLGdCQUFnQjs7Ozs7RUFFdkIsTUFBTSxvQkFBb0I7QUFDeEIsV0FBUSxJQUFJLFFBQVE7O0VBR3RCLE1BQU0sTUFBTSxJQUFJLGNBQWM7Ozs7Ozs7Ozs7Ozs7OztzQkFJNUIsb0JBSU0sY0FISixhQUVhLHdCQUZBLEtBQUssWUFBRzswQkFDTiwrQkFBYjtHQUFhO0dBQUE7R0FBUjtHQUFFOztHQUFBIiwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJBcHAudnVlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgc2V0dXAgbGFuZz1cInRzXCI+XG5pbXBvcnQgeyByZWYgfSBmcm9tICd2dWUnO1xuaW1wb3J0IEhlbGxvV29ybGQgZnJvbSAnLi9jb21wb25lbnRzL0hlbGxvV29ybGQudnVlJztcblxuY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdjbGljaycpO1xufTtcblxuY29uc3QgbXNnID0gcmVmKCdIZWxsbyBXb3JsZCcpO1xuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICA8SGVsbG9Xb3JsZCA6bXNnPVwibXNnXCI+XG4gICAgICA8ZGl2PuaPkuanvTwvZGl2PlxuICAgIDwvSGVsbG9Xb3JsZD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c3R5bGUgc2NvcGVkPlxuLmxvZ28ge1xuICBoZWlnaHQ6IDZlbTtcbiAgcGFkZGluZzogMS41ZW07XG4gIHdpbGwtY2hhbmdlOiBmaWx0ZXI7XG4gIHRyYW5zaXRpb246IGZpbHRlciAzMDBtcztcbn1cbi5sb2dvOmhvdmVyIHtcbiAgZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgMmVtICM2NDZjZmZhYSk7XG59XG4ubG9nby52dWU6aG92ZXIge1xuICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCAyZW0gIzQyYjg4M2FhKTtcbn1cbjwvc3R5bGU+XG4iXSwiZmlsZSI6IkQ6L+WtpuS5oC93emJfa25vd2xlZGdlX2Jhc2Uv5rqQ56CB5a2m5LmgL3Z1ZUAzLjUuMjYvcGxheWdyb3VuZC9zcmMvQXBwLnZ1ZSJ9

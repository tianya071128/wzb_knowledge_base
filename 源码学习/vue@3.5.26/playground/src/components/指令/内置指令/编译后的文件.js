import { createHotContext as __vite__createHotContext } from '/@vite/client';
import.meta.hot = __vite__createHotContext(
  '/src/components/指令/内置指令/InternalDirectivesDemo.vue'
);
import { defineComponent as _defineComponent } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1770195752789';
import { ref } from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1770195752789';
import '/src/components/指令/内置指令/内置指令.ts?t=1770195752789';
import InternalDirectivesDemSon from '/src/components/指令/内置指令/InternalDirectivesDemSon.vue?t=1770195752789';
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'InternalDirectivesDemo',
  setup(__props, { expose: __expose }) {
    __expose();
    const count = ref(0);
    const handleClick = () => {
      count.value++;
    };
    const __returned__ = {
      count,
      handleClick,
      InternalDirectivesDemSon,
    };
    Object.defineProperty(__returned__, '__isScriptSetup', {
      enumerable: false,
      value: true,
    });
    return __returned__;
  },
});
import {
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
  createElementVNode as _createElementVNode,
  renderList as _renderList,
  Fragment as _Fragment,
  toDisplayString as _toDisplayString,
  mergeProps as _mergeProps,
  withModifiers as _withModifiers,
  createVNode as _createVNode,
  setBlockTracking as _setBlockTracking,
  vShow as _vShow,
  withDirectives as _withDirectives,
  vModelText as _vModelText,
} from '/@fs/D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/code/packages/vue/src/index.ts?t=1770195752789';
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };
const _hoisted_3 = { key: 2 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock('div', null, [
      $setup.count < 2
        ? (_openBlock(), _createElementBlock('div', _hoisted_1, 'v-if 指令'))
        : $setup.count < 10
          ? (_openBlock(),
            _createElementBlock('div', _hoisted_2, 'v-else-if 指令'))
          : (_openBlock(),
            _createElementBlock(
              'div',
              _hoisted_3,
              ' v-else 指令: 如果不加 v-else, 那么会自动添加一个 v-if 注释VNode 占位 '
            )),
      _cache[4] ||
        (_cache[4] = _createElementVNode(
          'div',
          { textContent: 'v-text 指令, 会将子节点覆盖' },
          null,
          -1
          /* CACHED */
        )),
      _cache[5] ||
        (_cache[5] = _createElementVNode(
          'div',
          { innerHTML: 'v-html 指令, 会将子节点覆盖' },
          null,
          -1
          /* CACHED */
        )),
      (_openBlock(),
      _createElementBlock(
        _Fragment,
        null,
        _renderList(5, (item, index) => {
          return _createElementVNode(
            'div',
            { key: index },
            _toDisplayString(item),
            1
            /* TEXT */
          );
        }),
        64
        /* STABLE_FRAGMENT */
      )),
      _createElementVNode(
        'div',
        _mergeProps(
          {
            id: 'hello',
            'other-attr': 'words',
          },
          { '.someProperty': { test: 1 } }
        ),
        ' v-bind 指令 ',
        48
        /* FULL_PROPS, NEED_HYDRATION */
      ),
      _createElementVNode(
        'div',
        {
          onClick: _withModifiers($setup.handleClick, ['stop']),
          onBlurOnceCapture: $setup.handleClick,
        },
        ' v-on 指令 ',
        32
        /* NEED_HYDRATION */
      ),
      _createVNode($setup['InternalDirectivesDemSon'], {
        onFind: _withModifiers(($event) => 1, ['stop']),
      }),
      _cache[6] ||
        (_cache[6] = _createElementVNode(
          'div',
          null,
          [
            _createElementVNode(
              'span',
              { ':id': 'count' },
              '{{ this will not be compiled }}'
            ),
          ],
          -1
          /* CACHED */
        )),
      _cache[0] ||
        (_setBlockTracking(-1, true),
        ((_cache[0] = _createElementVNode('div', null, [
          _cache[3] ||
            (_cache[3] = _createElementVNode(
              'div',
              null,
              'Comment',
              -1
              /* CACHED */
            )),
          _createElementVNode(
            'p',
            null,
            _toDisplayString($setup.count),
            1
            /* TEXT */
          ),
        ])).cacheIndex = 0),
        _setBlockTracking(1),
        _cache[0]),
      _withDirectives(
        _createElementVNode(
          'h1',
          null,
          'v-show 指令',
          512
          /* NEED_PATCH */
        ),
        [[_vShow, $setup.count]]
      ),
      _withDirectives(
        _createElementVNode(
          'input',
          {
            type: 'text',
            'onUpdate:modelValue':
              _cache[1] || (_cache[1] = ($event) => ($setup.count = $event)),
          },
          null,
          512
          /* NEED_PATCH */
        ),
        [[_vModelText, $setup.count]]
      ),
      _createVNode(
        $setup['InternalDirectivesDemSon'],
        {
          modelValue: $setup.count,
          'onUpdate:modelValue':
            _cache[2] || (_cache[2] = ($event) => ($setup.count = $event)),
        },
        null,
        8,
        ['modelValue']
      ),
    ])
  );
}
_sfc_main.__hmrId = 'c170259e';
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
    'D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/components/指令/内置指令/InternalDirectivesDemo.vue',
  ],
]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IjtBQUNBLFNBQTZCLFdBQVc7QUFDeEMsT0FBTztBQUNQLE9BQU8sOEJBQThCOzs7OztFQUNyQyxNQUFNLFFBQVEsSUFBSSxFQUFFO0VBRXBCLE1BQU0sb0JBQW9CO0FBQ3hCLFNBQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBS04sb0JBcUNNO0VBcENPLGVBQUssbUJBQWhCLG9CQUFtQyxtQkFBYixVQUFPLElBQ2IsZUFBSyxvQkFBckIsb0JBQThDLG1CQUFsQixlQUFZLG1CQUN4QyxvQkFFTSxtQkFGTSxzREFFWjs0QkFFQTtHQUF5QztHQUFBLGVBQTVCLHNCQUFvQjtHQUFBO0dBQUE7O0dBQUE7NEJBRWpDO0dBQXlDO0dBQUEsRUFBcEMsV0FBUSxzQkFBb0I7R0FBQTtHQUFBOztHQUFBO2lCQUVqQztHQUE2RDtHQUFBO0dBQUEsWUFBaEMsSUFBaEIsTUFBTSxVQUFLO1dBQXhCO0tBQTZEO0tBQUEsRUFBNUIsS0FBSyxPQUFLO0tBQUEsaUJBQUssS0FBSTtLQUFBOztLQUFBOzs7OztFQUVwRDtHQUlNO0dBSk4sWUFJTTtJQUhJO0lBQUE7SUFBc0MsSUFDN0MsaUJBQW1CLFdBQVc7R0FBRTtHQUVuQzs7R0FBQTtFQUVBO0dBRU07R0FBQTtJQUZBLFNBQUssZUFBTyxvQkFBVzt1QkFBc0I7O0dBQWE7R0FFaEU7O0dBQUE7RUFDQSxhQUEyQyxzQ0FBaEIsUUFBSSwyQkFBTyxHQUFDOzRCQUV2QztHQUVNO0dBQUE7R0FBQSxDQURKLG9CQUF3RCxVQUFsRCxPQUFJLFNBQU8sRUFBQyxrQ0FBK0I7Ozs7MERBR25ELG9CQUdNLHdDQUZKO0dBQWtCO0dBQUE7R0FBYjtHQUFPOztHQUFBLEdBQ1o7R0FBa0I7R0FBQTtHQUFBLGlCQUFaLGFBQUs7R0FBQTs7R0FBQTtrQkFHYjtHQUFpQztHQUFBO0dBQWQ7R0FBUzs7R0FBQSxZQUFoQixhQUFLO2tCQUVqQjtHQUFxQztHQUFBO0lBQTlCLE1BQUs7aUVBQWdCLGVBQUs7Ozs7O29CQUFMLGFBQUs7RUFDakMsYUFBNEM7ZUFBVDtnRUFBQSxlQUFLIiwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJJbnRlcm5hbERpcmVjdGl2ZXNEZW1vLnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0IHNldHVwIGxhbmc9XCJ0c1wiPlxyXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50Vk5vZGUsIHJlZiB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCAnLi/lhoXnva7mjIfku6QnO1xyXG5pbXBvcnQgSW50ZXJuYWxEaXJlY3RpdmVzRGVtU29uIGZyb20gJy4vSW50ZXJuYWxEaXJlY3RpdmVzRGVtU29uLnZ1ZSc7XHJcbmNvbnN0IGNvdW50ID0gcmVmKDApO1xyXG5cclxuY29uc3QgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XHJcbiAgY291bnQudmFsdWUrKztcclxufTtcclxuPC9zY3JpcHQ+XHJcblxyXG48dGVtcGxhdGU+XHJcbiAgPGRpdj5cclxuICAgIDxkaXYgdi1pZj1cImNvdW50IDwgMlwiPnYtaWYg5oyH5LukPC9kaXY+XHJcbiAgICA8ZGl2IHYtZWxzZS1pZj1cImNvdW50IDwgMTBcIj52LWVsc2UtaWYg5oyH5LukPC9kaXY+XHJcbiAgICA8ZGl2IHYtZWxzZT5cclxuICAgICAgdi1lbHNlIOaMh+S7pDog5aaC5p6c5LiN5YqgIHYtZWxzZSwg6YKj5LmI5Lya6Ieq5Yqo5re75Yqg5LiA5LiqIHYtaWYg5rOo6YeKVk5vZGUg5Y2g5L2NXHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IHYtdGV4dD1cIid2LXRleHQg5oyH5LukLCDkvJrlsIblrZDoioLngrnopobnm5YnXCI+PC9kaXY+XHJcblxyXG4gICAgPGRpdiB2LWh0bWw9XCIndi1odG1sIOaMh+S7pCwg5Lya5bCG5a2Q6IqC54K56KaG55uWJ1wiPjwvZGl2PlxyXG5cclxuICAgIDxkaXYgdi1mb3I9XCIoaXRlbSwgaW5kZXgpIGluIDVcIiA6a2V5PVwiaW5kZXhcIj57eyBpdGVtIH19PC9kaXY+XHJcblxyXG4gICAgPGRpdlxyXG4gICAgICB2LWJpbmQ9XCJ7IGlkOiAnaGVsbG8nLCAnb3RoZXItYXR0cic6ICd3b3JkcycgfVwiXHJcbiAgICAgIDpzb21lUHJvcGVydHkucHJvcD1cInsgdGVzdDogMSB9XCI+XHJcbiAgICAgIHYtYmluZCDmjIfku6RcclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgQGNsaWNrLnN0b3A9XCJoYW5kbGVDbGlja1wiIEBibHVyLm9uY2UuY2FwdHVyZT1cImhhbmRsZUNsaWNrXCI+XHJcbiAgICAgIHYtb24g5oyH5LukXHJcbiAgICA8L2Rpdj5cclxuICAgIDxJbnRlcm5hbERpcmVjdGl2ZXNEZW1Tb24gQGZpbmQuc3RvcD1cIjFcIiAvPlxyXG5cclxuICAgIDxkaXYgdi1wcmU+XHJcbiAgICAgIDxzcGFuIDppZD1cImNvdW50XCI+e3sgdGhpcyB3aWxsIG5vdCBiZSBjb21waWxlZCB9fTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgdi1vbmNlPlxyXG4gICAgICA8ZGl2PkNvbW1lbnQ8L2Rpdj5cclxuICAgICAgPHA+e3sgY291bnQgfX08L3A+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8aDEgdi1zaG93PVwiY291bnRcIj52LXNob3cg5oyH5LukPC9oMT5cclxuXHJcbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiB2LW1vZGVsPVwiY291bnRcIiAvPlxyXG4gICAgPEludGVybmFsRGlyZWN0aXZlc0RlbVNvbiB2LW1vZGVsPVwiY291bnRcIiAvPlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzY3NzXCIgc2NvcGVkPjwvc3R5bGU+XHJcbiJdLCJmaWxlIjoiRDov5a2m5LmgL3d6Yl9rbm93bGVkZ2VfYmFzZS/mupDnoIHlrabkuaAvdnVlQDMuNS4yNi9wbGF5Z3JvdW5kL3NyYy9jb21wb25lbnRzL+aMh+S7pC/lhoXnva7mjIfku6QvSW50ZXJuYWxEaXJlY3RpdmVzRGVtby52dWUifQ==

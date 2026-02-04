import { mergeProps, withModifiers, vShow, createVNode, vModelText } from 'vue';
import { patchEvent } from '../../../../../code/packages/runtime-dom/src/modules/events';
import { emit } from '../../../../../code/packages/runtime-core/src/componentEmits';

/**
 * 大部分指令都是在编译阶段就处理了的, 而不是内置了指令的定义对象
 */
/**
 * v-if、v-else、v-else-if
 *
 *  - 会在编译后的 render 函数中, 根据条件不同, 生成不同的 VNode
 *    $setup.count < 2
 *      ? (_openBlock(), _createElementBlock('div', _hoisted_1, 'v-if 指令'))
 *      : $setup.count < 10
 *        ? (_openBlock(),
 *          _createElementBlock('div', _hoisted_2, 'v-else-if 指令'))
 *        : (_openBlock(),
 *          _createElementBlock(
 *            'div',
 *            _hoisted_3,
 *            ' v-else 指令: 如果不加 v-else, 那么会自动添加一个 v-if 注释VNode 占位 '
 *          )),
 */

/**
 * v-text/v-html
 *
 *  - 会在编译后, 转化为 textContent 和 innerHTML 属性，这样直接对原生元素作用 el.textContent = value/el.innerHTML = value
 *    _cache[2] ||
 *       (_cache[2] = _createElementVNode(
 *         'div',
 *         { textContent: 'v-text 指令, 会将子节点覆盖' },
 *         null,
 *         -1
 *       )),
 *     _cache[3] ||
 *       (_cache[3] = _createElementVNode(
 *         'div',
 *         { innerHTML: 'v-html 指令, 会将子节点覆盖' },
 *         null,
 *         -1
 *       )),
 */

/**
 * v-for
 *
 *  - 同样是在编译阶段, 循环生成 VNode, 但是会用 Fragment 包裹, 使其成为一个整体, 这样在做比较时, 能够在针对 vfor 的 VNode 数组执行比对
 *     _createElementBlock(
 *       _Fragment,
 *       null,
 *       _renderList(5, (item, index) => {
 *         return _createElementVNode(
 *           'div',
 *           { key: index },
 *           _toDisplayString(item),
 *           1
 *         );
 *       }),
 *       64
 *     )),
 */

/**
 * v-bind
 *
 *  - 在编译阶段, 生成 VNode 的 props 参数
 *      -- 对于使用 v-bind="object", 会使用 mergeProps 方法与其他 props 进行合并
 *      -- 对于修饰符, 在属性值之前添加 '.' 和 '^' 标识区分
 *
 *      _createElementVNode(
 *        'div',
 *        _mergeProps(
 *          {
 *            id: 'hello',
 *            'other-attr': 'words',
 *          },
 *          { '.someProperty': { test: 1 } }
 *        ),
 *        ' v-bind 指令 ',
 *        48
 *      )
 */

/**
 * v-on
 *
 *  - 在编译阶段, 添加 onXXX prop 属性
 *      -- 如果使用修饰符
 *          --- 对于 once、passive、capture 修饰符, 会在事件名称后面添加 Once 、Passive、Capture 标识
 *               ---- 原生元素时, 在添加事件 el.addEventListener 时, 会组装成对应的选项
 *                    参考 packages/runtime-dom/src/modules/events 的 patchEvent 方法
 *               ---- 对于组件事件, 只支持 Once, 在执行事件时, 会去查找 eventName + 'Once' 的事件处理函数, 存在的话会执行一次
 *                    参考 packages/runtime-core/src/componentEmits 的 emit 方法
 *          --- 其他的会使用 withModifiers 方法封装一层, 处理修饰符的功能
 *
 *   _createElementVNode(
 *     'div',
 *     {
 *        onClick: _withModifiers(($event) => 1, ['stop'])
 *        // once和capture 修饰符
 *        onBlurOnceCapture: $setup.handleClick
 *     },
 *     'v-on 指令'
 *   ),
 *   // 组件也是一样的逻辑
 *   _createVNode($setup['InternalDirectivesDemSon'], {
 *     onFind: _withModifiers(($event) => 1, ['stop']),
 *   }),
 */

/**
 * v-show
 *
 *    - 根据不同的平台, 注入不同的内置指令
 *        -- 作用对象为组件时, 依照指令的规则, 会透传至根节点上
 *    - 在编译期间, 会导入 vShow 指令使用, vShow 具体功能参考 vShow 方法
 *
 *    _withDirectives(
 *      _createElementVNode(
 *        'h1',
 *        null,
 *        'v-show 指令',
 *        512
 *      ),
 *      // v-show 指令
 *      [[_vShow, $setup.count]]
 *    ),
 *
 */

/**
 * v-model
 *
 *    - 作用对象不同, 机制不同
 *        -- 原生元素时, 根据不同的元素类型, 注入不同的内置指令, 以及生成一个事件, 用于更改绑定值
 *           具体参考 vModelText 等相关方法
 *            _withDirectives(
 *              _createElementVNode(
 *                'input',
 *                {
 *                  type: 'text',
 *                  // 生成一个事件, 用于更改绑定值
 *                  'onUpdate:modelValue':
 *                    _cache[1] || (_cache[1] = ($event) => ($setup.count = $event)),
 *                },
 *                null,
 *                512
 *              ),
 *              // 根据原生元素的不同, 注入的指令也有所差异
 *              [[_vModelText, $setup.count]]
 *            ),
 *         -- 组件时, 不使用指令, 直接生成对应的 prop 属性, 使用 prop 和 emit 实现
 *             _createVNode(
 *               $setup['InternalDirectivesDemSon'],
 *               {
 *                 modelValue: $setup.count,
 *                 'onUpdate:modelValue':
 *                   _cache[2] || (_cache[2] = ($event) => ($setup.count = $event)),
 *               },
 *               null,
 *               8,
 *             ),
 */

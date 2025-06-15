# 类：`EventEmitter`

`EventEmitter` 是 Node.js 中实现**事件驱动编程**的核心类，它基于**发布 - 订阅模式**（Publish-Subscribe Pattern），允许对象之间通过事件进行松耦合通信。

## 创建 EventEmitter 实例

- **语法**: `new EventEmitter([options])`
  - **参数**:
    - `options`: 可选
      - `captureRejections`: 用于捕获对 `promise `的拒绝

## 事件监听方法

### emitter.on

- **方法**: `emitter.on(eventName, listener)`

  - **作用**: 用于注册事件监听器
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'data'`、`'error'`。
    - `listener`（函数）：事件触发时执行的回调函数。
  - **返回值**：返回 `EventEmitter` 实例（支持链式调用）

- **特性**

  - **执行顺序**: 按注册顺序执行
  - **最大监听器数量**: 默认 10 个，可通过 `setMaxListeners` 修改
  - **多次调用传入相同的 `eventName` 和 `listener` 组合将导致多次添加和调用 `listener`。**

- **示例**

  ```js
  const emitter = new EventEmitter();
  // 注册监听器
  emitter.on('message', (data, timestamp) => {
    console.log(`收到消息: ${data} (${new Date(timestamp)})`);
  });

  // 触发事件并传递参数
  emitter.emit('message', 'Hello World', Date.now());
  ```

### emitter.addListener

`emitter.on(eventName, listener)` 的别名。

### emitter.once

- **方法**: `emitter.once(eventName, listener)`

  - **作用**: 用于注册**一次性事件监听器**。
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'connect'`、`'ready'`。
    - `listener`（函数）：事件触发时执行的回调函数。
  - **返回值**：返回 `EventEmitter` 实例（支持链式调用）。

- **特性**:

  - **只执行一次**: 监听器在事件首次触发后自动移除，后续触发不再执行
  - **执行顺序**: 按注册顺序执行

- **示例**:

  ```js
  const emitter = new EventEmitter<{ init: [] }>();
  // 注册监听器
  emitter.once('init', () => {
    console.log('初始化完成');
  });

  emitter.emit('init'); // 输出: 初始化完成
  emitter.emit('init'); // 无输出（监听器已移除）
  ```

### emitter.prependListener

- **方法**: `emitter.prependListener(eventName, listener)`;

  - **作用**: 用于注册事件监听器的特殊方法，与 `on()` 和 `once()` 不同，它将监听器添加到事件队列的**开头**，确保该监听器在同一事件的其他监听器**之前执行**。
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'data'`、`'error'`。
    - `listener`（函数）：事件触发时执行的回调函数。
  - **返回值**：返回 `EventEmitter` 实例（支持链式调用）。

- **特性**:

  - **优先执行**: 监听器会被添加到队列开头，优先于其他监听器执行

- **示例**:

  ```js
  const emitter = new EventEmitter();

  // 注册普通监听器
  emitter.on('order', () => console.log('第三个执行'));
  emitter.on('order', () => console.log('第四个执行'));

  // 注册前置监听器
  emitter.prependListener('order', () => console.log('第二个执行'));
  emitter.prependListener('order', () => console.log('第一个执行'));
  emitter.emit('order');
  // 输出:
  // 第一个执行
  // 第二个执行
  // 第三个执行
  // 第四个执行
  ```

### emitter.prependOnceListener

- **方法**: `emitter.prependOnceListener(eventName, listener)`
  - **作用**: 特殊的事件监听器注册方法，它结合了 `prependListener()` 和 `once()` 的特性：**将监听器添加到事件队列的开头**（确保优先执行），并在**首次触发后自动移除**
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'connect'`、`'ready'`。
    - `listener`（函数）：事件触发时执行的回调函数。
  - **返回值**：返回 `EventEmitter` 实例（支持链式调用）。
- **特性**:
  - **优先执行**: 监听器会被添加到队列开头，优先于其他监听器执行
  - **仅执行一次**: 首次触发后自动移除，后续触发不再执行

## 事件触发方法

### emitter.emit

- **方法**: `emitter.emit(eventName[, ...args])`

  - **作用**: 触发事件并执行对应监听器
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'data'`、`'error'`。
    - `...args`（可选）：传递给监听器的参数。
  - **返回值**：
    - `true`：若事件有监听器。
    - `false`：若事件无监听器。

- **示例**

  ```js
  const emitter = new EventEmitter();

  // 注册监听器
  emitter.on('message', (data, userId) => {
    console.log(`用户 ${userId} 发送: ${data}`);
  });

  // 触发事件并传递参数
  emitter.emit('message', 'Hello', 123); // 输出: 用户 123 发送: Hello
  ```

## 事件移除方法

### emitter.removeListener

- **方法**: `emitter.removeListener(eventName, listener)`

  - **作用**: 移除已注册事件监听器
  - **参数**：
    - `eventName`（字符串）：事件名称，如 `'data'`、`'error'`。
    - `listener`（函数）：要移除的监听器函数（**必须是同一引用**）。
  - **返回值**：返回 `EventEmitter` 实例（支持链式调用）。

- **核心特性**

  - **通过引用匹配移除**: 必须传入与注册时相同的函数引用才能成功移除
  - **一旦事件被触发，则所有在触发时绑定到它的监听器都会被依次调用**。这意味着在触发之后和最后一个监听器完成执行之前的任何 `removeListener()` 或 `removeAllListeners()` 调用都不会将它们从正在进行的 `emit()` 中删除。后续事件按预期运行。
  - **当单个函数被多次添加为单个事件的句柄时**，则 `removeListener()` 将删除最近添加的实例。

- **示例**

  ```js
  const emitter = new EventEmitter();
  function pong() {
    console.log('pong');
  }

  emitter.on('ping', pong);
  emitter.once('ping', pong);
  emitter.removeListener('ping', pong); // 同一函数多次注册, 只会删除最新的引用

  emitter.emit('ping'); // 输出: pong --> once 注册的被删除
  emitter.emit('ping'); // 输出: pong
  ```

### emitter.off

[`emitter.removeListener()`](https://nodejs.cn/api/v22/events.html#emitterremovelistenereventname-listener) 的别名。

### emitter.removeAllListeners

- **方法**: `emitter.removeAllListeners([eventName])`

  - **作用**: 将特定事件或所有事件的监听器移除
  - **参数**：`eventName`（可选），这是一个字符串或者 `Symbol`，代表事件的名称
  - **返回值**：返回当前的 `EventEmitter` 实例，支持链式调用

- **示例**

  ```js
  const emitter = new EventEmitter();

  const callback1 = () => console.log('监听器 1');
  const callback2 = () => console.log('监听器 2');
  emitter.on('message', callback1);
  emitter.once('message', callback2);
  emitter.removeAllListeners('message'); // 移除 'message' 事件的所有监听器

  emitter.emit('message'); // 不会有输出
  ```

## 事件查询方法

### emitter.listeners

- **方法**: `emitter.listeners(eventName)`

  - **作用**: 返回名为 `eventName` 的事件的监听器数组的副本
  - **参数**：`eventName`，它是一个字符串或者 `Symbol`，代表事件的名称
  - **返回值**：返回一个数组，数组中的元素是注册到该事件的监听器函数，或者是监听器对象（当使用 `{ once: true }` 选项注册时）

- **特性**

  - **返回浅拷贝的数组**: 对这个数组进行修改不会影响实际的监听器列表

  - **空事件返回空数组**

  - **保留监听器的执行顺序**: 返回数组的顺序与执行的顺序是一致的

    ```js
    emitter.prependListener('message', () => console.log('前置监听器'));
    const listeners = emitter.listeners('message');
    // 数组顺序: [前置监听器, callback1, callback2]
    ```

- **示例**

  ```js
  const emitter = new EventEmitter();

  const callback1 = () => console.log('监听器 1');
  const callback2 = () => console.log('监听器 2');

  emitter.on('message', callback1);
  emitter.on('message', callback2);

  console.log(emitter.listeners('message');); // [ [Function: callback1], [Function: callback2] ]
  ```

### emitter.listenerCount

- **方法**:`emitter.listenerCount(eventName[, listener])`
  - **作用**: 用于获取指定事件的监听器数量
  - **参数**：
    - `eventName`（必需）：字符串或 `Symbol`，表示事件名称。
    - `listener`（函数）：事件处理函数。如果提供了，它将返回在事件的监听器列表中找到监听器的次数
  - **返回值**：
    - `number`：返回注册到该事件的监听器数量。若事件不存在，返回 `0`。

### emitter.eventNames

- **方法**: `emitter.eventNames()`

  - **作用**: 返回已注册监听器的事件名称的数组。
  - **参数**: 无
  - **返回值**：返回一个数组，包含已注册事件的名称。数组元素可以是字符串或 `Symbol` 类型。

- **特性**

  - **只返回有监听器的事件**: 若事件的所有监听器被移除，该事件名称不会出现在返回值中
  - **包含内置事件**: 如 `newListener` 和 `removeListener` 等内置事件也会被返回，前提是这些事件已注册监听器

- **示例**

  ```js
  const emitter = new EventEmitter();

  emitter.on('message', () => {});
  emitter.on('error', () => {});

  console.log(emitter.eventNames()); // 输出: [ 'message', 'error' ]
  ```

## 高级控制方法

### emitter.setMaxListeners

- **方法**: `emitter.setMaxListeners(n)`
  - **作用**: 设置单个事件允许注册的最大监听器数量。
  - **参数**：
    - `n`（必需）：数值类型，表示最大监听器数量。设置为 `0` 表示不限制。
  - **返回值**：返回 `EventEmitter` 实例，支持链式调用。
- **特性**:
  - **设置全局警告阈值**: 默认情况下，当单个事件的监听器数量超过 **10** 个时，Node.js 会发出警告（⚠️ 非强制限制）。通过 `setMaxListeners()` 可以修改这个阈值。
  - **禁用监听器数量限制**: 设置 `n` 为 `0` 可以完全移除限制（不推荐在生产环境使用）。
  - **仅触发警告，非强制限制**: 即使超过最大数量，监听器仍会被注册。Node.js 仅在超过阈值时打印警告信息

### emitter.getMaxListeners

- **方法**: `emitter.getMaxListeners()`
  - **作用**: 获取当前 `EventEmitter` 实例设置的最大监听器数量限制。
  - **参数**: 无
  - **返回值**:
    - `number`：返回当前设置的最大监听器数量。默认值为 `10`，若通过 `setMaxListeners(0)` 取消限制，则返回 `0`。

## 内置事件

### 事件：'newListener'

- **事件**: `emitter.on('newListener', listener)`

  - **作用**: 是一个特殊的内置事件，当有新的监听器被添加到实例时触发。
  - **函数处理器的接收参数**:
    - `eventName`: 正在监听的事件的名称
    - `listener`: 事件处理函数

- **特性**:

  - **包含内置方法触发的添加**: 无论是通过 `on()`、`once()` 还是其他方法添加监听器，都会触发该事件

  - **在添加监听器之前触发事件的事实具有微妙但重要的副作用**：在 `'newListener'` 回调中注册到同一 `name` 的任何其他监听器都将插入到正在添加的监听器之前。

  - **触发时机**: `newListener` 事件在新监听器**已添加到内部队列之前**触发。因此，在回调中查询 `listenerCount()` 不会包含新添加的监听器

    ```js
    const emitter = new EventEmitter();
    emitter.on('newListener', (eventName) => {
      console.log(
        `当前 "${eventName}" 监听器数量: ${emitter.listenerCount(eventName)}`
      );
    });
    emitter.on('data', () => {}); // 输出: 当前 "data" 监听器数量: 0
    ```

  - **监听自身添加**: 可以监听 `newListener` 事件自身的添加操作

    ```js
    const emitter = new EventEmitter();
    emitter.on('newListener', (eventName) => {
      if (eventName === 'newListener') {
        console.log('添加了一个 newListener 监听器');
      }
    }); // 这里不会触发
    emitter.on('newListener', () => {}); // 触发上述回调
    ```

### 事件：'removeListener'

- **事件**: `emitter.on('newListener', listener)`
  - **作用**: 一个特殊的内置事件，当有监听器被移除时触发。
  - **函数处理器的接收参数**:
    - `eventName`: 正在监听的事件的名称
    - `listener`: 事件处理函数
- **特性**:
  - **触发时机**: 在监听器**已从内部队列移除后**触发。因此，在回调中查询 `listenerCount()` 不会包含刚被移除的监听器。

### 事件：'error'

**事件**: `emitter.error('newListener', listener)`

- **作用**: 一个特殊的内置事件，当有监听器被移除时触发。
- **函数处理器的接收参数**:
  - `eventName`: 正在监听的事件的名称
  - `listener`: 事件处理函数
- **特性**: 待续

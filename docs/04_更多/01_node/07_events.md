# events 事件触发器

在 Node.js 中，`events` 模块是核心模块之一，用于实现**事件驱动编程**。它提供了 `EventEmitter` 类，允许对象（发布者）触发事件，并让其他对象（订阅者）监听这些事件，从而实现组件间的解耦和异步通信。

**许多 Node.js 的内置模块（如 `fs`、`net`、`http` 等）都继承自 `EventEmitter`，以便能够触发和监听事件**。

## 核心作用

1. **实现高效的事件发布 - 订阅模式**
2. **模块间通信**: 实现不同模块间的松耦合交互。

## 参数

`eventEmitter.emit()` 方法允许将任意一组参数传给监听器函数。

监听方法的回调函数会接受这些参数

```js
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function (a, b) {
  console.log(a, b); // 打印 a b
});
myEmitter.emit('event', 'a', 'b');
```

## this 指向

- 调用普通的监听器函数时，标准的 `this` 关键字会被有意地设置为引用监听器绑定到的 `EventEmitter` 实例。
- 使用 ES6 箭头函数作为监听器，但是，这样做时，`this` 关键字将不再引用 `EventEmitter` 实例

## 错误处理

待续

# events 事件触发器

在 Node.js 中，`events` 模块是核心模块之一，用于实现**事件驱动编程**。它提供了 `EventEmitter` 类，允许对象（发布者）触发事件，并让其他对象（订阅者）监听这些事件，从而实现组件间的解耦和异步通信。

**许多 Node.js 的内置模块（如 `fs`、`net`、`http` 等）都继承自 `EventEmitter`，以便能够触发和监听事件**。

## 核心作用

1. **实现高效的事件发布 - 订阅模式**
2. **模块间通信**: 实现不同模块间的松耦合交互。

## 类：`EventEmitter`

`EventEmitter` 是 Node.js 中实现**事件驱动编程**的核心类，它基于**发布 - 订阅模式**（Publish-Subscribe Pattern），允许对象之间通过事件进行松耦合通信。

### 创建 EventEmitter 实例

* **语法**: `new EventEmitter([options])`
  * **参数**:
    * `options`: 可选
      * `captureRejections`: 用于捕获对 `promise `的拒绝

### 事件监听方法

#### emitter.on

#### emitter.once

#### emitter.prependListener

#### emitter.prependOnceListener

### 事件触发方法

#### emit

### 事件移除方法

#### removeListener

#### removeAllListeners

### 事件查询方法

#### listeners

#### listenerCount

#### eventNames

### 高级控制方法

#### setMaxListeners

#### getMaxListeners

### 内置事件

#### 事件：'newListener'

#### 事件：'removeListener'

#### 事件：'error'








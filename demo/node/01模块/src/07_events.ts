import EventEmitter from 'node:events';

/**
 * 创建 EventEmitter 实例
 */
{
  // 创建实例
  const emitter = new EventEmitter();
}

// #region ------------ 事件监听方法 ------------

/**
 * emitter.on(eventName, listener): 注册事件
 */
{
  const emitter = new EventEmitter<{ message: [string, number] }>();
  // 注册监听器
  emitter.on('message', (data, timestamp) => {
    console.log(`收到消息: ${data} (${new Date(timestamp)})`);
  });

  // 触发事件并传递参数
  emitter.emit('message', 'Hello World', Date.now());
}

/**
 * emitter.once(eventName, listener): 注册一次性事件
 */
{
  const emitter = new EventEmitter<{ init: [] }>();
  // 注册监听器
  emitter.once('init', () => {
    console.log('初始化完成');
  });

  emitter.emit('init'); // 输出: 初始化完成
  emitter.emit('init'); // 无输出（监听器已移除）
}

/**
 * emitter.prependListener(eventName, listener): 注册事件到监听器数组的开头
 */
{
  const emitter = new EventEmitter();

  // 注册普通监听器
  emitter.on('order', function callback1() {
    console.log('第三个执行');
  });
  emitter.on('order', function callback2() {
    console.log('第四个执行');
  });

  // 注册前置监听器
  emitter.prependListener('order', function callback3() {
    console.log('第二个执行');
  });
  emitter.prependListener('order', function callback4() {
    console.log('第一个执行');
  });

  emitter.emit('order');
  // 输出:
  // 第一个执行
  // 第二个执行
  // 第三个执行
  // 第四个执行
}
// #endregion

// #region ------------ 事件触发方法 ------------
/**
 * emitter.emit(eventName[, ...args]): 触发事件
 */
{
  const emitter = new EventEmitter();

  // 注册监听器
  emitter.on('message', (data, userId) => {
    console.log(`用户 ${userId} 发送: ${data}`);
  });

  // 触发事件并传递参数
  emitter.emit('message', 'Hello', 123); // 输出: 用户 123 发送: Hello
}
// #endregion

// #region ------------ 事件移除方法 ------------
/**
 * emitter.removeListener(eventName, listener): 移除已注册事件监听器
 */
{
  const emitter = new EventEmitter();

  function pong() {
    console.log('pong');
  }

  emitter.on('ping', pong);
  emitter.once('ping', pong);
  emitter.removeListener('ping', pong); // 同一函数多次注册, 只会删除最新的引用

  emitter.emit('ping'); // 输出: pong --> once 注册的被删除
  emitter.emit('ping'); // 输出: pong
}

/**
 * emitter.removeAllListeners([eventName]): 将特定事件或所有事件的监听器移除
 */
{
  const emitter = new EventEmitter();

  const callback1 = () => console.log('监听器 1');
  const callback2 = () => console.log('监听器 2');

  emitter.on('message', callback1);
  emitter.once('message', callback2);

  emitter.removeAllListeners('message'); // 移除 'message' 事件的所有监听器
  emitter.emit('message'); // 不会有输出
}
// #endregion

// #region ------------ 内置事件 ------------
/**
 * newListener 事件
 */
{
  const emitter = new EventEmitter();

  emitter.on('removeListener', (eventName) => {
    console.log(
      `当前 "${eventName}" 监听器数量: ${emitter.listenerCount(eventName)}`
    );
  });

  const listener = () => {};
  emitter.on('data', listener);

  emitter.removeListener('data', listener); // 输出: 当前 "data" 监听器数量: 0（如果只存在一个监听器）
}

/**
 * error 内置事件
 */
{
  const emitter = new EventEmitter();

  // 注册 error 事件监听器
  emitter.on('error', (err, n) => {
    console.error('错误已处理:', err.message, n);
  });

  // 触发错误 - 主动触发
  // emitter.emit('error', new Error('模拟错误'), 2);

  emitter.on('data', () => {
    throw new Error('模拟错误');
  });
  emitter.emit('data');
}
// #endregion

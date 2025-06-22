# URLSearchParams 类

`URLSearchParams` 是一个内置类，用于处理 URL 中的**查询参数（query string）**。它提供了一组方法，使查询参数的操作更加便捷，避免了手动拼接和解析字符串的复杂性。

WHATWG `URLSearchParams` 接口和 [`querystring`](https://nodejs.cn/api/v22/querystring.html) 模块具有相似的用途，但 [`querystring`](https://nodejs.cn/api/v22/querystring.html) 模块的用途更通用，因为它允许自定义的分隔符（`&` 和 `=`）。换句话说，**此 API 纯粹是为网址查询字符串而设计**。

**`URLSearchParams` 类也在全局对象上可用**。

## 创建 URLSearchParams 实例

### 从 URL 实例获取

当创建 `URL` 实例时, `url.searchParams` 属性表示网址查询参数的 [`URLSearchParams`](https://nodejs.cn/api/v22/url.html#class-urlsearchparams) 对象。

```js
const url = new URL('https://example.com/api?page=1');
const params = url.searchParams;
console.log(params.get('page')); // 输出: 1
```

### new URLSearchParams()

- **方法**: `new URLSearchParams([init])`

  - **作用**: 实例化 `URLSearchParams` 对象。
  - **参数**:
    - **init**: 可选参数，支持字符串、对象、[Iterable](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)

- **构造函数参数类型**

  1. **无参数**：创建空的查询参数对象

     ```js
     const params = new URLSearchParams();
     params.append('name', 'John');
     params.append('age', '30');

     console.log(params.toString()); // 输出: name=John&age=30
     ```

  2. **字符串参数**: 
  
     * 将 `string` 解析为查询字符串，并使用它来实例化新的 `URLSearchParams` 对象。前导 `'?'`（如果存在）将被忽略。
     * **格式**：`key1=value1&key2=value2`（可包含开头的 `?`，会被自动忽略）。
  
     ```js
     const params1 = new URLSearchParams('page=1&limit=10');
     const params2 = new URLSearchParams('?sort=asc'); // 开头的 ? 会被忽略
     
     console.log(params1.get('limit')); // 输出: 10
     console.log(params2.toString());   // 输出: sort=asc
     ```
  
  3. **对象参数**
  
     * **格式**：`{ key1: 'value1', key2: 'value2' }`。
     * `obj` 的每个属性的键和值总是被强制转换为字符串。
     * 与 [`querystring`](https://nodejs.cn/api/v22/querystring.html) 模块不同，不允许以数组值的形式出现重复的键。数组使用 [`array.toString()`](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString) 字符串化，它**简单地用逗号连接所有数组元素**。
  
     ```js
     const params = new URLSearchParams({
       user: 'abc',
       query: ['first', 'second'], // 会设置为 'first,second'
     });
     console.log(params.getAll('query'));
     // 输出 [ 'first,second' ]
     console.log(params.toString());
     // 输出 'user=abc&query=first%2Csecond'
     ```
  
  4. **[Iterable](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)参数**
  
     * `iterable` 可以是 `Array` 或任何可迭代对象。
  
     ```js
     let params;
     
     // 使用数组
     params = new URLSearchParams([
       ['user', 'abc'],
       ['query', 'first'],
       ['query', 'second'],
     ]);
     console.log(params.toString());// 输出 'user=abc&query=first&query=second'
     
     
     ```
  
     * 这意味着 `iterable` 可以是另一个 `URLSearchParams`，在这种情况下，**构造函数将简单地创建提供的 `URLSearchParams` 的克隆**。
  
     ```js
     const original = new URLSearchParams('a=1&b=2');
     const copy = new URLSearchParams(original);
     
     copy.append('c', '3');
     console.log(copy.toString()); // 输出: a=1&b=2&c=3
     ```
  
- **自动编码特殊字符**: 参数值中的特殊字符会被自动编码

## 查询参数

### get(name)

* **方法**: `URLSearchParams.get(name)`

  * **作用**: 返回名称为 `name` 的第一个名称-值对的值。如果没有这样的对，则返回 `null`。
  * **参数**：`name`（字符串）- 要查找的键名。
  * **返回值**：匹配的第一个值（字符串）或 `null`。

* **处理重复键**: 当键存在多个值时，get() 仅返回第一个值

  ```js
  const params = new URLSearchParams('color=red&color=blue&color=green');
  
  console.log(params.get('color'));    // 输出: 'red'
  console.log(params.getAll('color')); // 输出: ['red', 'blue', 'green']
  ```

### getAll(name)

* **方法**: `urlSearchParams.getAll(name)`

  * **作用**: 返回查询参数中与指定键关联的所有值，以数组形式返回。若键不存在，返回空数组 `[]`。
  * **参数**：`name`（字符串）- 要查找的键名。
  * **返回值**：包含所有匹配值的数组（字符串数组）。

* **处理重复键**: 当键存在多个值时，getAll() 返回所有值

  ```js
  const params = new URLSearchParams('ids=1&ids=2&ids=3');
  
  console.log(params.getAll('ids')); // 输出: ['1', '2', '3']
  ```

### has(name[, value])

* **方法**: `urlSearchParams.has(name[, value]`

  * **作用**: 检查查询参数中是否存在指定的键（及可选的值）。
  * **参数**：
    - `name`（字符串）- 要检查的键名。
    - `value`（字符串，可选）- 要检查的具体值。
  * **返回值**：布尔值（`true` 或 `false`）。

* **可选的值**：

  * 如果提供了 `value`，则当存在具有相同 `name` 和 `value` 的名称-值对时返回 `true`。
  * 如果未提供 `value`，则如果至少有一个名称为 `name` 的名称-值对，则返回 `true`。

  ```js
  const params = new URLSearchParams('color=red&color=blue');
  
  console.log(params.has('color', 'red'));    // 输出: true
  console.log(params.has('color', 'green'));  // 输出: false
  console.log(params.has('size', 'large'));   // 输出: false
  ```

### size

* **属性**: `urlSearchParams.size`
  * **作用**: 只读属性，用于返回查询参数中**键的数量**。
  * **返回值**: 非负整数，仅统计键的数量，不考虑重复键。

## 操作参数

### append(name, value)

* **方法**：`urlSearchParams.append(name, value)`

  * **作用**: 向查询参数中添加一个新的键值对。**若键已存在，则保留原有值并添加新值**。
  * **参数**：
    - `name`（字符串）- 要添加的键名。
    - `value`（字符串）- 要添加的值。
  * **返回值**：`undefined`（直接修改原对象）。

* **处理重复键**：添加新值，保留原有值

  ```js
  const params = new URLSearchParams();
  
  params.append('color', 'red');
  params.append('color', 'blue');
  
  console.log(params.toString());     // 输出: color=red&color=blue
  console.log(params.getAll('color')); // 输出: ['red', 'blue']
  ```

* **与 set () 方法对比**

  | 方法                  | 描述                 | 处理重复键的方式     |
  | --------------------- | -------------------- | -------------------- |
  | `append(name, value)` | 添加新值，保留原有值 | 允许同一键存在多个值 |
  | `set(name, value)`    | 设置值，覆盖原有值   | 仅保留最后设置的值   |

### set(name, value)

* **方法**: `urlSearchParams.set(name, value)`

  * **作用**: **设置或覆盖查询参数中的键值对**。若键已存在，会删除所有旧值并添加新值；若键不存在，则创建新键值对。
  * **参数**：
    - `name`（字符串）- 要设置的键名。
    - `value`（字符串）- 要设置的值。
  * **返回值**：`undefined`（直接修改原对象）。

* **覆盖已有键的值**

  ```js
  const params = new URLSearchParams('color=red&color=blue');
  
  params.set('color', 'green');
  console.log(params.toString());     // 输出: color=green
  console.log(params.getAll('color')); // 输出: ['green']（所有旧值被删除）
  ```

### delete(name)

* **方法**: `urlSearchParams.delete(name[, value])`

  * **作用**: 删除查询参数中的键值对
    * 如果提供了 `value`，则删除名称为 `name` 且值为 `value` 的所有名称-值对。
    * 如果未提供 `value`，则删除名称为 `name` 的所有名称-值对。
  * **参数**：
    - `name`（字符串）- 要删除的键名。
    - `value`（字符串，可选）- 要删除的具体值。
  * **返回值**：`undefined`（直接修改原对象）。

* **删除指定键的特定值**

  ```js
  const params = new URLSearchParams('color=red&color=blue&color=green');
  
  params.delete('color', 'blue');
  console.log(params.toString());     // 输出: color=red&color=green
  console.log(params.getAll('color')); // 输出: ['red', 'green']
  ```

## 遍历参数

**迭代方法的对比**:

| 方法        | 描述                     | 返回值类型   |
| ----------- | ------------------------ | ------------ |
| `keys()`    | 返回所有键名的迭代器     | 迭代器对象   |
| `values()`  | 返回所有值的迭代器       | 迭代器对象   |
| `entries()` | 返回所有键值对的迭代器   | 迭代器对象   |
| `forEach()` | 遍历所有键值对并执行回调 | 无（副作用） |

### keys()

* **方法**: `urlSearchParams.keys()`

  * **作用**: 返回一个包含查询参数中所有**键名**的迭代器，按插入顺序排列。
  * **返回值**：一个可迭代对象（实现了 `Symbol.iterator` 方法），包含所有键名（字符串）。

* **特点**：

  - **重复的键名会被重复包含**。
  - 键名按插入顺序返回（或按原始 URL 中的顺序）。

  ```js
  const params = new URLSearchParams('a=1&b=2&a=3');
  
  for (const key of params.keys()) {
    console.log(key);
  }
  // 输出:
  // a
  // b
  // a --> 重复的键名会被重复包含
  ```

### values()

* **方法**: `urlSearchParams.values()`

  * **作用**: 返回一个包含查询参数中所有值的迭代器，按插入顺序排列。
  * **返回值**：一个可迭代对象（实现了 `Symbol.iterator` 方法），包含所有值（字符串）。

* **特点**：

  - **重复的键对应的值会被重复包含**。
  - 值按插入顺序返回（或按原始 URL 中的顺序）。

  ```js
  const params = new URLSearchParams('a=1&b=2&a=3');
  
  for (const value of params.values()) {
    console.log(value);
  }
  // 输出:
  // 1
  // 2
  // 3 --> 重复的键对应的值会被重复包含
  ```

### entries()

* **方法**: `urlSearchParams.entries()`
  * **作用**: 返回一个包含查询参数中所有**键值对**的迭代器，按插入顺序排列。
  * **返回值**：一个可迭代对象（实现了 `Symbol.iterator` 方法），每个元素是一个包含两个元素的数组 `[key, value]`。
* **特点**：
  - 重复的键会被重复包含。
  - 键值对按插入顺序返回（或按原始 URL 中的顺序）。

### forEach(callback)

* **方法**: `urlSearchParams.forEach(fn[, thisArg])`

  * **作用**: 遍历查询参数中的每个键值对，并对每个键值对执行一次提供的回调函数。
  * **参数**：
    * `fn`（函数）- 回调函数，接收三个参数：
      * `value`（字符串）- 当前键对应的值。
      * `key`（字符串）- 当前的键名。
      * `searchParams`（URLSearchParams）- 调用该方法的实例本身。
    * `thisArg`（可选）- 执行回调函数时作为 `this` 的值。
  * **返回值**：`undefined`（无返回值，仅执行副作用）。

## 排序与序列化

### sort()

* **方法**: `urlSearchParams.sort()`

  * **作用**: 按键名的 Unicode 码点顺序对查询参数进行排序，原地修改参数对象。
  * **参数**：无。
  * **返回值**：`undefined`（直接修改原对象）。

* **特点**：

  - 仅按键名排序，不考虑值。
  - 保留重复键的顺序（相同键名的键值对保持原有相对顺序）。
  - 排序后，迭代方法（如 `entries()`、`forEach()`）将按新顺序返回键值对。

  ```js
  const params = new URLSearchParams('b=2&a=1&c=3');
  params.sort();
  
  console.log(params.toString()); // 输出: a=1&b=2&c=3
  ```

### toString()

* **方法**: `urlSearchParams.toString()`

  * **作用**: 返回查询参数的字符串表示形式，格式为 key1=value1&key2=value2，并自动编码特殊字符。
  * **参数**：无。
  * **返回值**：格式化的查询参数字符串（不含 `?` 前缀）。

* **特点**：

  - 保留参数的插入顺序（除非调用过 `sort()`）。
  - 自动编码特殊字符（如空格、`&`、`=` 等）。
  - 空值会被编码为 `key=`。

  ```js
  const params = new URLSearchParams();
  params.append('empty', '');
  params.append('data', '22');
  params.append('missing', undefined); // undefined 会被转换为 "undefined" --> 相当于调用 String(undefined)
  
  console.log(params.toString()); // 输出: empty=&data=22&missing=undefined
  ```

  
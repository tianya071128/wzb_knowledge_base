import url, { URL as URL2 } from 'node:url';

/**
 * 浏览器兼容的 URL 类，按照 WHATWG 网址标准实现。
 */

// #region ------------ URL: 创建新的 URL 对象 ------------
// 网址构造函数可作为全局对象的属性访问。也可以从内置的 url 模块中导入：
console.log(URL2 === globalThis.URL); //true

/**
 * 创建 ---> 通过 URL 类创建 URL 对象
 * 具有如下属性，大部分属性可读写
 * URL {
 *   href: 'https://abc:xyz@nodejs.cn:81/api/url.html?abc=xyz#class_url', 序列化的网址 --> 将此属性的值设置为新值相当于使用 new URL(value) 创建新的 URL 对象。URL 对象的每个属性都将被修改。
 *   origin: 'https://nodejs.cn:81', 网址的源的只读的序列化
 *   protocol: 'https:', 协议部分
 *   username: 'abc', 网址的用户名部分
 *   password: 'xyz', 密码部分
 *   host: 'nodejs.cn:81', 网址的主机部分，包含端口
 *   hostname: 'nodejs.cn', 网址的主机名部分, 不包含端口
 *   port: '81', 网址的端口部分
 *   pathname: '/api/url.html', 网址的路径部分
 *   search: '?abc=xyz', 网址的序列化的查询部分
 *   searchParams: URLSearchParams {}, 网址查询参数的 URLSearchParams 对象。 ---> 该属性是只读的，但它提供的 URLSearchParams 对象可用于改变 URL 实例；
 *   hash: '#class_url' 网址的片段部分
 * }
 */
let myURL = new URL(
  'https://abc:xyz@nodejs.cn:81/api/url.html?abc=xyz#class_url'
);
console.log(myURL);
// #endregion

// #region ------------ URL 类的静态方法 ------------
{
  // 1. URL.createObjectURL(blob) --> 创建表示给定的 <Blob> 对象并且可用于稍后检索 Blob 的 'blob:nodedata:...' 网址字符串。
  // 2. URL.revokeObjectURL(id) --> 删除由给定标识符标识的已存储的 <Blob>。尝试撤销未注册的 ID 将静默失败。
}

// #endregion

// #region ------------ 类：URLSearchParams ------------
/**
 * URLSearchParams API 提供对 URL 查询的读写访问。
 *  WHATWG URLSearchParams 接口和 querystring 模块具有相似的用途，但 querystring 模块的用途更通用，因为它允许自定义的分隔符（& 和 =）。
 *  换句话说，此 API 纯粹是为网址查询字符串而设计。
 */

/**
 * 创建, 返回 URLSearchParams 对象
 */
const params = new URLSearchParams('user=abc&query=xyz');

// urlSearchParams.append(name, value) --> 将新的名称-值对追加到查询字符串。
{
  params.append('user', 's');
  console.log(params.toString()); // user=abc&query=xyz&user=s
}

// urlSearchParams.delete(name[, value]) --> 删除
{
  params.delete('user', 's'); // 如果提供了 value，则删除名称为 name 且值为 value 的所有名称-值对。
  console.log(params.toString()); // user=abc&query=xyz

  params.append('user', 'a'); // user=abc&query=xyz&user=a
  params.delete('user'); // 如果未提供 value，则删除名称为 name 的所有名称-值对。
  console.log(params.toString()); // query=xyz
}

// urlSearchParams.get(name) --> 返回名称为 name 的第一个名称-值对的值。
// urlSearchParams.getAll(name) --> 返回名称为 name 的所有名称-值对的值。
{
  params.append('user', 'a');
  params.append('user', 'b'); // query=xyz&user=a&user=b
  console.log(params.get('user')); // a
  console.log(params.getAll('user')); // [ 'a', 'b' ]
}

// 将与 name 关联的 URLSearchParams 对象中的值设置为 value。
// 如果存在任何名称为 name 的预先存在的名称-值对，则将第一个此类对的值设置为 value 并删除所有其他名称。
// 如果没有，则将名称-值对追加到查询字符串。
{
  const params = new URLSearchParams();
  params.append('foo', 'bar');
  params.append('foo', 'baz');
  params.append('abc', 'def');
  console.log(params.toString()); // foo=bar&foo=baz&abc=def

  params.set('foo', 'def'); // 设置第一个 foo, 其他的清除
  params.set('xyz', 'opq'); // 没有的话就追加
  console.log(params.toString()); // foo=def&abc=def&xyz=opq
}
// #endregion
console.log(url.domainToASCII('中文.com'));

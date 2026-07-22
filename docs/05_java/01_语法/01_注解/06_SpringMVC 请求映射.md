# SpringMVC 请求映射

Spring MVC 通过注解将 HTTP 请求映射到 Controller 方法，简化 Web 开发中的路由配置。

## @RequestMapping

通用请求映射注解，可标注在类或方法上。标注在类上时，该类下所有方法的请求路径都以该路径为前缀。

### 基本用法

```java
@RestController
@RequestMapping("/api/user")
public class UserController {

    @RequestMapping("/list")
    public List<User> list() {
        // 匹配: GET /api/user/list
        return userService.findAll();
    }
}
```

### value / path — 请求路径

指定映射的 URL 路径，支持多个路径、路径变量和 Ant 风格通配符：

```java
// 多路径映射
@RequestMapping({"/user", "/member"})
public User getUser() {}

// 路径变量
@RequestMapping("/user/{id}")
public User getById(@PathVariable Long id) {}

// Ant 风格通配符
// ? 匹配单个字符: /user/a, /user/b
// * 匹配任意字符: /user/list, /user/create
// ** 匹配任意目录层级: /api/user/list, /api/user/a/b/list
@RequestMapping("/user/*")
@RequestMapping("/user/**")
```

### method — 请求方法

限定请求的 HTTP 方法，不指定时匹配所有方法：

```java
@RequestMapping(value = "/user", method = RequestMethod.GET)
public List<User> list() {}

@RequestMapping(value = "/user", method = {RequestMethod.GET, RequestMethod.POST})
public Object handle() {}
```

### params — 请求参数条件

根据请求参数（query string）进行匹配：

```java
// 必须包含 type 参数
@RequestMapping(value = "/user", params = "type")
public List<User> byType() {}

// type 参数必须等于 admin
@RequestMapping(value = "/user", params = "type=admin")
public List<User> adminList() {}

// 不能包含 type 参数
@RequestMapping(value = "/user", params = "!type")
public List<User> noType() {}

// type 不能等于 admin
@RequestMapping(value = "/user", params = "type!=admin")
public List<User> notAdmin() {}
```

### headers — 请求头条件

根据请求头进行匹配：

```java
// 必须包含 Content-Type 头
@RequestMapping(value = "/user", headers = "Content-Type")
public List<User> list() {}

// Content-Type 必须是 application/json
@RequestMapping(value = "/user", headers = "Content-Type=application/json")
public List<User> jsonOnly() {}

// 不接受 Accept: text/html
@RequestMapping(value = "/user", headers = "Accept!=text/html")
public List<User> notHtml() {}
```

### consumes — 请求体类型

限定请求的 Content-Type，只有请求头 Content-Type 匹配时才处理：

```java
// 只接受 JSON
@RequestMapping(value = "/user", consumes = "application/json")
public User create(@RequestBody User user) {}

// 只接受表单
@RequestMapping(value = "/user", consumes = "application/x-www-form-urlencoded")
public User createFromForm(User user) {}
```

### produces — 响应体类型

限定响应的 Content-Type，只有请求头 Accept 匹配时才处理：

```java
// 只返回 JSON
@RequestMapping(value = "/user", produces = "application/json")
public List<User> list() {}

// 返回纯文本
@RequestMapping(value = "/user/hello", produces = "text/plain")
public String hello() {
    return "Hello World";
}
```

## 快捷映射注解

Spring 4.3 引入了一组 `@RequestMapping` 的快捷注解，语义更清晰，代码更简洁：

| 注解 | 等价于 |
| --- | --- |
| `@GetMapping` | `@RequestMapping(method = RequestMethod.GET)` |
| `@PostMapping` | `@RequestMapping(method = RequestMethod.POST)` |
| `@PutMapping` | `@RequestMapping(method = RequestMethod.PUT)` |
| `@DeleteMapping` | `@RequestMapping(method = RequestMethod.DELETE)` |
| `@PatchMapping` | `@RequestMapping(method = RequestMethod.PATCH)` |

> 注意：这些注解只能用在**方法**上，不能用在类上。类级别的路径前缀仍需使用 `@RequestMapping`。

### @GetMapping — 查询资源

用于获取数据，对应 RESTful 的"读"操作：

```java
// 查询列表
@GetMapping("/users")
public List<User> list() {}

// 查询单个
@GetMapping("/users/{id}")
public User getById(@PathVariable Long id) {}

// 支持所有 @RequestMapping 的属性（params、headers、consumes、produces 等）
@GetMapping(value = "/users", produces = "application/json")
public List<User> listJson() {}
```

### @PostMapping — 创建资源

用于提交数据、创建资源：

```java
// 创建用户（JSON 请求体）
@PostMapping("/users")
public User create(@RequestBody User user) {}

// 表单提交
@PostMapping(value = "/users", consumes = "application/x-www-form-urlencoded")
public User createFromForm(User user) {}

// 文件上传
@PostMapping(value = "/upload", consumes = "multipart/form-data")
public String upload(@RequestParam("file") MultipartFile file) {}
```

### @PutMapping — 全量更新资源

用于替换/完整更新指定资源：

```java
@PutMapping("/users/{id}")
public User update(@PathVariable Long id, @RequestBody User user) {
    user.setId(id);
    return userService.update(user);
}
```

### @DeleteMapping — 删除资源

用于删除指定资源：

```java
@DeleteMapping("/users/{id}")
public void delete(@PathVariable Long id) {
    userService.deleteById(id);
}
```

### @PatchMapping — 部分更新资源

用于对资源进行局部更新（与 PUT 的区别）：

```java
@PatchMapping("/users/{id}")
public User patch(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
    // 只更新传入的字段
    return userService.patch(id, fields);
}
```

### 对比总结

| 注解 | 语义 | 幂等 | 典型场景 |
| --- | --- | --- | --- |
| `@GetMapping` | 读取 | 是 | 查询列表、查看详情 |
| `@PostMapping` | 创建 | 否 | 新增数据、文件上传 |
| `@PutMapping` | 全量替换 | 是 | 完整更新资源 |
| `@DeleteMapping` | 删除 | 是 | 删除资源 |
| `@PatchMapping` | 局部更新 | 否 | 修改部分字段 |


## 参数绑定注解

### @PathVariable（路径变量）

从 URL 路径中提取变量：

```java
@GetMapping("/user/{id}")
public User getById(@PathVariable Long id) {
    // URL: /user/123 → id = 123
}

// 路径变量名与方法参数名不同时
@GetMapping("/user/{userId}")
public User getById(@PathVariable("userId") Long id) {}
```

属性：

| 属性 | 说明 |
| --- | --- |
| `value` / `name` | 路径变量名（参数名与变量名一致时可省略） |
| `required` | 是否必须存在（默认 true，为 false 时变量不存在则参数为 null） |

```java
// required = false：路径变量可选
@GetMapping({"/user/{id}", "/user"})
public User getById(@PathVariable(required = false) Long id) {
    // /user → id = null
    // /user/123 → id = 123
}
```

### @RequestParam（请求参数）

从查询参数（query string）或表单中获取值：

```java
@GetMapping("/search")
public List<User> search(
    @RequestParam String keyword,
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size
) {
    // URL: /search?keyword=张三&page=2&size=20
}
```

属性：

| 属性 | 说明 |
| --- | --- |
| `value` / `name` | 参数名（参数名一致时可省略） |
| `required` | 是否必须（默认 true） |
| `defaultValue` | 默认值（设置后 required 自动变为 false） |

```java
// 参数名不一致时指定 name
@GetMapping("/search")
public List<User> search(@RequestParam(name = "kw") String keyword) {
    // URL: /search?kw=张三 → keyword = "张三"
}

// required = false：参数可选
@GetMapping("/users")
public List<User> list(@RequestParam(required = false) String status) {
    // /users → status = null
    // /users?status=active → status = "active"
}

// 接收多个同名参数为数组
@GetMapping("/search")
public List<User> search(@RequestParam String[] tags) {
    // URL: /search?tags=java&tags=spring → tags = ["java", "spring"]
}
```

### @RequestBody（请求体）

将请求体（如 JSON）反序列化为 Java 对象，常用于 POST/PUT 请求：

```java
@PostMapping("/user")
public User create(@RequestBody User user) {
    // 请求体: {"name": "张三", "age": 25}
    // → user.getName() = "张三"
}
```

属性：

| 属性 | 说明 |
| --- | --- |
| `required` | 是否必须有请求体（默认 true，为 false 时请求体为空则参数为 null） |

```java
// required = false：允许请求体为空
@PutMapping("/user/{id}")
public User update(@PathVariable Long id, @RequestBody(required = false) User user) {
    // 无请求体时 user = null
}
```

> 注意：`@RequestBody` 底层依赖 `HttpMessageConverter`（如 Jackson）进行反序列化，请求头 `Content-Type` 需匹配（如 `application/json`）。

### @RequestHeader（请求头）

获取请求头中的信息：

```java
@GetMapping("/info")
public String info(@RequestHeader("User-Agent") String userAgent) {
    return userAgent;
}
```

属性：

| 属性 | 说明 |
| --- | --- |
| `value` / `name` | 请求头名称 |
| `required` | 是否必须存在（默认 true） |
| `defaultValue` | 请求头不存在时的默认值 |

```java
// 获取多个请求头
@GetMapping("/info")
public String info(
        @RequestHeader("Authorization") String token,
        @RequestHeader(value = "X-Request-Id", required = false) String requestId) {
    // requestId 可以为空
}

// 获取所有请求头为 Map
@GetMapping("/info")
public Map<String, String> allHeaders(@RequestHeader Map<String, String> headers) {
    return headers;
}
```

### @CookieValue（Cookie 值）

获取请求中的 Cookie 值：

```java
@GetMapping("/user")
public String getUser(@CookieValue("JSESSIONID") String sessionId) {
    return sessionId;
}
```

属性：

| 属性 | 说明 |
| --- | --- |
| `value` / `name` | Cookie 名称 |
| `required` | 是否必须存在（默认 true） |
| `defaultValue` | Cookie 不存在时的默认值 |

```java
@GetMapping("/user")
public String getUser(@CookieValue(value = "token", required = false) String token) {
    // token 可以为 null
}
```

## 完整示例

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    // GET /api/users?page=1&size=10
    @GetMapping
    public Page<User> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.findPage(page, size);
    }

    // GET /api/users/123
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    // POST /api/users  Body: {"name":"张三"}
    @PostMapping
    public User create(@RequestBody User user) {
        return userService.save(user);
    }

    // PUT /api/users/123  Body: {"name":"李四"}
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.update(user);
    }

    // DELETE /api/users/123
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
```

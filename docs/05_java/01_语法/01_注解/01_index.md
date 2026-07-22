# 注解

## 注解的本质

注解（Annotation）是 Java 5 引入的一种元数据机制，用于为代码添加额外的描述信息。**注解本身不会改变程序的执行逻辑，但可以被编译器、开发工具或运行时框架读取和处理**。

## 注解的作用

- **为编译器提供信息**：编译器可以利用注解检测错误或抑制警告，例如 `@Override` 帮助编译器检查方法是否正确重写了父类方法。
- **编译时处理**：注解处理器（Annotation Processor）可以在编译阶段读取注解，自动生成代码、配置文件等，例如 Lombok 的 `@Data` 自动生成 getter/setter。
- **运行时处理**：通过反射机制在运行时读取注解，实现动态行为，例如 Spring 的 `@Autowired` 实现依赖注入、`@RequestMapping` 实现路由映射。
- **文档生成**：Javadoc 工具可以读取注解来生成 API 文档，例如 `@author`、`@param`、`@return` 等。

## 注解的分类

| 分类 | 说明 | 示例 |
| --- | --- | --- |
| 元注解 | 用于定义注解的注解 | `@Target`、`@Retention`、`@Documented`、`@Inherited` |
| 内置注解 | JDK 自带的注解 | `@Override`、`@Deprecated`、`@SuppressWarnings` |
| 第三方框架注解(或自定义注解) | 第三方框架提供的注解(或开发者根据需求自行定义的注解) | `@RequestMapping`、`@GetMapping`等 |


package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.StudentCreateRequestDTO;
import com.example.demo.dto.StudentDTO;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * POST请求控制器 --> 演示Spring Boot中POST请求的多种使用方式
 */

/**
 * @RestController: 组合注解
 * - @Controller: 标记当前类是 MVC 控制器，Spring 扫描时把它注册为 Bean，接收 HTTP 请求；
 * - @ResponseBody: 标记方法返回值应绑定到 Web 响应体中，而不是解析为视图。
 */
@RestController
/**
 * @RequestMapping: 标记请求映射，指定基础路径为 /api/students
 * 与 GetController 共享同一资源路径，通过 HTTP 方法区分操作
 */
@RequestMapping("/api/students")
public class PostController {

    /**
     * 模拟数据源（实际项目中应使用数据库）
     */
    private final List<StudentDTO> studentList = new ArrayList<>(List.of(
            StudentDTO.builder().id(1L).name("张三").age(20).major("计算机科学").email("zhangsan@example.com").build(),
            StudentDTO.builder().id(2L).name("李四").age(22).major("软件工程").email("lisi@example.com").build(),
            StudentDTO.builder().id(3L).name("王五").age(21).major("人工智能").email("wangwu@example.com").build()
    ));

    /**
     * 自增ID生成器，模拟数据库主键自增
     */
    private final AtomicLong idGenerator = new AtomicLong(4L);

    /**
     * JSON请求体POST请求（最常用）
     *
     * @PostMapping: 是 @RequestMapping 的派生简化注解，专门限定仅接收 POST 请求。
     * @RequestBody: 将请求体中的 JSON 数据自动反序列化为 Java 对象。
     * - Spring 默认使用 Jackson 库完成 JSON 与对象的转换；
     * - 要求前端请求头 Content-Type 为 application/json；
     * - 参数对象的字段名需与 JSON 中的 key 对应。
     */
    @PostMapping
    public ApiResponse<StudentDTO> createStudent(@RequestBody StudentDTO student) {
        // 基本参数校验
        if (student.getName() == null || student.getName().isBlank()) {
            return ApiResponse.error(400, "学生姓名不能为空");
        }
        if (student.getAge() == null || student.getAge() <= 0) {
            return ApiResponse.error(400, "年龄必须为正整数");
        }

        // 分配ID并加入数据源
        student.setId(idGenerator.getAndIncrement());
        studentList.add(student);

        return ApiResponse.success("创建成功", student);
    }

    /**
     * 表单提交POST请求
     *
     * @PostMapping("/form"): 表示 POST 方法的请求路径
     * @RequestParam: 获取表单参数（Content-Type: application/x-www-form-urlencoded）
     * - 也适用于 URL 查询参数传值的场景；
     * - required：是否必传，默认 true；
     * - defaultValue：默认值，当参数未传或为空时使用。
     */
    @PostMapping("/form")
    public ApiResponse<StudentDTO> createStudentByForm(
            @RequestParam String name,
            @RequestParam Integer age,
            @RequestParam(required = false, defaultValue = "未填写") String major,
            @RequestParam(required = false, defaultValue = "未填写") String email) {

        if (name.isBlank()) {
            return ApiResponse.error(400, "学生姓名不能为空");
        }

        StudentDTO student = StudentDTO.builder()
                .id(idGenerator.getAndIncrement())
                .name(name)
                .age(age)
                .major(major)
                .email(email)
                .build();

        studentList.add(student);

        return ApiResponse.success("表单提交成功", student);
    }

    /**
     * 嵌套对象入参POST请求
     *
     * @PostMapping("/register"): 表示注册操作的请求路径
     * @RequestBody StudentCreateRequestDTO: 接收包含嵌套对象的 JSON 请求体。
     * - Jackson 支持自动反序列化嵌套对象（对象中套对象）；
     * - 嵌套的 "address" 字段会自动映射为 AddressDTO 实例；
     * - 嵌套的 "hobbies" 数组会自动映射为 List<String>；
     * - 嵌套层级可以是多层，Jackson 会递归处理。
     *
     * 请求体示例：
     * {
     *   "name": "张三",
     *   "age": 20,
     *   "major": "计算机科学",
     *   "email": "zhangsan@example.com",
     *   "address": {
     *     "province": "广东省",
     *     "city": "深圳市",
     *     "district": "南山区",
     *     "detail": "科技园路1号",
     *     "zipCode": "518000"
     *   },
     *   "hobbies": ["编程", "阅读", "篮球"]
     * }
     */
    @PostMapping("/register")
    public ApiResponse<StudentCreateRequestDTO> registerStudent(@RequestBody StudentCreateRequestDTO request) {
        // 基本参数校验
        if (request.getName() == null || request.getName().isBlank()) {
            return ApiResponse.error(400, "学生姓名不能为空");
        }
        if (request.getAge() == null || request.getAge() <= 0) {
            return ApiResponse.error(400, "年龄必须为正整数");
        }

        // 嵌套对象校验：地址信息（可选，但如果传了则城市不能为空）
        if (request.getAddress() != null) {
            if (request.getAddress().getCity() == null || request.getAddress().getCity().isBlank()) {
                return ApiResponse.error(400, "地址中的城市不能为空");
            }
        }

        // 将学生基本信息加入数据源
        StudentDTO student = StudentDTO.builder()
                .id(idGenerator.getAndIncrement())
                .name(request.getName())
                .age(request.getAge())
                .major(request.getMajor())
                .email(request.getEmail())
                .build();
        studentList.add(student);

        return ApiResponse.success("注册成功", request);
    }

    /**
     * 批量创建POST请求
     *
     * @PostMapping("/batch"): 表示批量操作的请求路径
     * @RequestBody List<StudentDTO>: 接收 JSON 数组，自动反序列化为 List 集合。
     * - 前端需发送 JSON 数组格式，如 [{...}, {...}]；
     * - 适用于批量导入、批量创建等场景。
     */
    @PostMapping("/batch")
    public ApiResponse<List<StudentDTO>> batchCreateStudents(@RequestBody List<StudentDTO> students) {
        if (students == null || students.isEmpty()) {
            return ApiResponse.error(400, "提交的学生列表不能为空");
        }

        // 逐条分配ID并加入数据源
        for (StudentDTO student : students) {
            student.setId(idGenerator.getAndIncrement());
            studentList.add(student);
        }

        return ApiResponse.success(
                String.format("批量创建成功，共%d条记录", students.size()),
                students);
    }
}

package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.StudentDTO;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * GET请求控制器 --> 演示Spring Boot中GET请求的多种使用方式
 */

/**
 * @RestController: 组合注解
 * - @Controller: 标记当前类是 MVC 控制器，Spring 扫描时把它注册为 Bean，接收 HTTP 请求；
 * - @ResponseBody: 标记方法返回值应绑定到 Web 响应体中，而不是解析为视图。
 * 单独加在方法上，只对当前接口生效；写在类上，对全部接口生效。
 */
@RestController
/**
 * @RequestMapping: 标记请求映射，指定基础路径为 /api/students
 *  - 类上加：给当前控制器所有接口统一拼接公共前缀；
 *  - 方法上加：追加子路径，最终完整地址 = 类路径 + 方法路径；
 */
@RequestMapping("/api/students")
public class GetController {

    /**
     * 模拟数据源（实际项目中应使用数据库）
     */
    private final List<StudentDTO> studentList = new ArrayList<>(List.of(
            StudentDTO.builder().id(1L).name("张三").age(20).major("计算机科学").email("zhangsan@example.com").build(),
            StudentDTO.builder().id(2L).name("李四").age(22).major("软件工程").email("lisi@example.com").build(),
            StudentDTO.builder().id(3L).name("王五").age(21).major("人工智能").email("wangwu@example.com").build(),
            StudentDTO.builder().id(4L).name("赵六").age(23).major("数据科学").email("zhaoliu@example.com").build(),
            StudentDTO.builder().id(5L).name("孙七").age(19).major("网络安全").email("sunqi@example.com").build()
    ));

    /**
     * 无参数GET请求
     *
     * @GetMapping: 是 @RequestMapping 的派生简化注解，专门限定仅接收 GET 请求。
     */
    @GetMapping
    public ApiResponse<List<StudentDTO>> getAllStudents() {
        if (studentList.isEmpty()) {
            return ApiResponse.error(404, "暂无学生数据");
        }
        return ApiResponse.success("查询成功", studentList);
    }

    /**
     * 路径参数GET请求
     *
     * @GetMapping("/{id}"): 表示路径请求参数
     * @PathVariable: 标记方法参数为路径变量，Spring 会自动将路径中的 {id} 绑定到该参数。
     * - 如果方法参数名与路径变量名一致，则可以省略 @PathVariable 注解的参数名
     * - 如果方法参数名与路径变量名不一致，则必须使用 @PathVariable("xxx") 注解指定路径变量名
     */
    @GetMapping("/{id}")
    public ApiResponse<StudentDTO> getStudentById(@PathVariable Long id) {
        Optional<StudentDTO> student = studentList
                .stream()
                .filter(item -> item.getId().equals(id))
                .findFirst();

        if (student.isEmpty()) {
            return ApiResponse.error(404, "未找到ID为 " + id + " 的学生");
        }

        return ApiResponse.success(student.get());
    }

    /**
     * 查询参数GET请求
     *
     * @GetMapping("/search"): 表示 GET 方法的请求路径
     * @RequestParam: 获取查询参数
     * - required：是否必传，默认 true
     * - defaultValue：默认值，当参数未传或为空时使用
     * - value(或者name)：参数名, 默认为方法形参名
     */
    @GetMapping("/search")
    public ApiResponse<List<StudentDTO>> searchStudents(
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.success(
                String.format("查询成功，共%d条记录，当前第%d页", 10, page),
                studentList);
    }
}

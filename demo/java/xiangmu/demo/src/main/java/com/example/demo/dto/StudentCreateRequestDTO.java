package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 学生创建请求对象（含嵌套对象）
 * 演示 POST 请求中接收嵌套 JSON 对象的入参方式
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
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCreateRequestDTO {

    /** 学生姓名 */
    private String name;

    /** 年龄 */
    private Integer age;

    /** 专业 */
    private String major;

    /** 邮箱 */
    private String email;

    /**
     * 嵌套对象：家庭地址
     * Jackson 会自动将 JSON 中的 "address" 对象反序列化为 AddressDTO 实例
     */
    private AddressDTO address;

    /**
     * 嵌套集合：兴趣爱好列表
     * Jackson 会自动将 JSON 数组反序列化为 List<String>
     */
    private List<String> hobbies;
}

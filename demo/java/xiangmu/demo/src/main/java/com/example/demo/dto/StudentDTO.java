package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 学生数据传输对象
 * 用于GET接口中返回学生信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {

    /** 学生ID */
    private Long id;

    /** 学生姓名 */
    private String name;

    /** 年龄 */
    private Integer age;

    /** 专业 */
    private String major;

    /** 邮箱 */
    private String email;
}

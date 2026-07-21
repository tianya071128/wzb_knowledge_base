package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 地址数据传输对象
 * 用于演示嵌套对象入参，作为 StudentCreateRequestDTO 的子对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    /** 省份 */
    private String province;

    /** 城市 */
    private String city;

    /** 区/县 */
    private String district;

    /** 详细地址 */
    private String detail;

    /** 邮政编码 */
    private String zipCode;
}

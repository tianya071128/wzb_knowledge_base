package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/test")
    public Map<String, Object> test() {
        return Map.of(
                "code", 200,
                "message", "测试接口调用成功",
                "data", "Hello from /test"
        );
    }
}

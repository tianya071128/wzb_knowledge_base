package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        // TODO: 实现实际的登录逻辑
        return Map.of(
                "code", 200,
                "message", "登录成功",
                "data", Map.of("username", request.getUsername())
        );
    }
}

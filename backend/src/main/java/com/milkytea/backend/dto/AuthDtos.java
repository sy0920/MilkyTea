package com.milkytea.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AuthDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "注册请求")
    public static class RegisterRequest {
        @NotBlank(message = "用户名不能为空")
        @Size(min = 3, max = 50, message = "用户名长度必须在3-50之间")
        @Schema(description = "用户名", example = "zhangsan")
        private String username;

        @NotBlank(message = "手机号不能为空")
        @Size(min = 11, max = 11, message = "手机号必须为11位")
        @Schema(description = "手机号", example = "13800138000")
        private String phone;

        @NotBlank(message = "密码不能为空")
        @Size(min = 6, max = 100, message = "密码长度必须在6-100之间")
        @Schema(description = "密码", example = "password123")
        private String password;

        @Schema(description = "昵称", example = "张三")
        private String nickname;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "登录请求")
    public static class LoginRequest {
        @NotBlank(message = "手机号不能为空")
        @Size(min = 11, max = 11, message = "手机号必须为11位")
        @Schema(description = "手机号", example = "13800138000")
        private String phone;

        @NotBlank(message = "密码不能为空")
        @Schema(description = "密码", example = "password123")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "认证响应")
    public static class AuthResponse {
        @Schema(description = "JWT令牌")
        private String token;

        @Schema(description = "令牌类型", example = "Bearer")
        private String type = "Bearer";

        @Schema(description = "用户ID")
        private Long userId;

        @Schema(description = "用户名")
        private String username;

        @Schema(description = "手机号")
        private String phone;

        public AuthResponse(String token, Long userId, String username, String phone) {
            this.token = token;
            this.userId = userId;
            this.username = username;
            this.phone = phone;
        }
    }
}

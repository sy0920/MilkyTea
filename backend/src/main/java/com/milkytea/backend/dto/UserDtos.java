package com.milkytea.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class UserDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "用户信息响应")
    public static class UserProfileResponse {
        @Schema(description = "用户ID")
        private Long id;

        @Schema(description = "用户名")
        private String username;

        @Schema(description = "手机号")
        private String phone;

        @Schema(description = "头像URL")
        private String avatar;

        @Schema(description = "创建时间")
        private LocalDateTime createdAt;

        @Schema(description = "更新时间")
        private LocalDateTime updatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "更新用户信息请求")
    public static class UpdateProfileRequest {
        @Size(min = 11, max = 11, message = "手机号必须为11位")
        @Schema(description = "手机号", example = "13800138000")
        private String phone;

        @Schema(description = "头像（Base64或URL）")
        private String avatar;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "修改密码请求")
    public static class ChangePasswordRequest {
        @Schema(description = "旧密码", example = "oldPassword123")
        private String oldPassword;

        @Size(min = 6, max = 100, message = "新密码长度必须在6-100之间")
        @Schema(description = "新密码", example = "newPassword123")
        private String newPassword;
    }
}

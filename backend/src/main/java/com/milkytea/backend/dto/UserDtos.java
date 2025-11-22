package com.milkytea.backend.dto;

import com.milkytea.backend.validation.ValidPassword;
import com.milkytea.backend.validation.ValidPhone;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
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
        @ValidPhone
        @Schema(description = "手机号", example = "13800138000")
        private String phone;

        @Schema(description = "头像（Base64或URL）")
        private String avatar;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "修改用户名请求")
    public static class UpdateUsernameRequest {
        @NotBlank(message = "新用户名不能为空")
        @Size(min = 3, max = 25, message = "用户名长度必须在3-25之间")
        @Schema(description = "新用户名", example = "new_username")
        private String newUsername;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "修改密码请求")
    public static class ChangePasswordRequest {
        @NotBlank(message = "旧密码不能为空")
        @Schema(description = "旧密码", example = "oldPassword123")
        private String oldPassword;

        @NotBlank(message = "新密码不能为空")
        @Size(min = 6, max = 25, message = "新密码长度必须在6-25之间")
        @ValidPassword
        @Schema(description = "新密码", example = "newPassword123")
        private String newPassword;
    }
}

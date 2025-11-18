package com.milkytea.backend.controller;

import com.milkytea.backend.dto.UserDtos;
import com.milkytea.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户信息相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "获取用户信息", description = "获取当前登录用户的个人信息")
    public ResponseEntity<UserDtos.UserProfileResponse> getProfile(Authentication authentication) {
        String username = authentication.getName();
        UserDtos.UserProfileResponse response = userService.getUserProfile(username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "更新用户信息", description = "更新当前登录用户的个人信息")
    public ResponseEntity<UserDtos.UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserDtos.UpdateProfileRequest request) {
        String username = authentication.getName();
        UserDtos.UserProfileResponse response = userService.updateUserProfile(username, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @Operation(summary = "修改密码", description = "修改当前登录用户的密码")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody UserDtos.ChangePasswordRequest request) {
        String username = authentication.getName();
        userService.changePassword(username, request);
        return ResponseEntity.ok().build();
    }
}

package com.milkytea.backend.service;

import com.milkytea.backend.dto.UserDtos;
import com.milkytea.backend.entity.User;
import com.milkytea.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDtos.UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

        return new UserDtos.UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getPhone(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    @Transactional
    public UserDtos.UserProfileResponse updateUserProfile(String username, UserDtos.UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

        // 如果修改手机号,检查手机号是否已被使用
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new RuntimeException("手机号已被使用");
            }
            user.setPhone(request.getPhone());
        }

        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        user = userRepository.save(user);

        return new UserDtos.UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getPhone(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    @Transactional
    public UserDtos.UserProfileResponse updateUsername(String currentUsername, UserDtos.UpdateUsernameRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

        // 检查新用户名是否已被使用
        if (!request.getNewUsername().equals(currentUsername) &&
                userRepository.existsByUsername(request.getNewUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        user.setUsername(request.getNewUsername());
        user = userRepository.save(user);

        return new UserDtos.UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getPhone(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    @Transactional
    public void changePassword(String username, UserDtos.ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

        // 验证旧密码
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("旧密码不正确");
        }

        // 设置新密码
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

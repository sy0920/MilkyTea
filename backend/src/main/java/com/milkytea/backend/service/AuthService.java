package com.milkytea.backend.service;

import com.milkytea.backend.dto.AuthDtos;
import com.milkytea.backend.entity.User;
import com.milkytea.backend.repository.UserRepository;
import com.milkytea.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 检查手机号是否已存在
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("手机号已被注册");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);

        // 生成JWT令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("phone", user.getPhone());
        String token = jwtUtil.generateToken(user.getUsername(), claims);

        return new AuthDtos.AuthResponse(token, user.getId(), user.getUsername(), user.getPhone());
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        // 根据手机号查找用户
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("手机号或密码错误"));

        // 验证用户凭证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

        // 生成JWT令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("phone", user.getPhone());
        String token = jwtUtil.generateToken(user.getUsername(), claims);

        return new AuthDtos.AuthResponse(token, user.getId(), user.getUsername(), user.getPhone());
    }
}

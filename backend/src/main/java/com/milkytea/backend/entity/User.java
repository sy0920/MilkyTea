package com.milkytea.backend.entity;

import com.milkytea.backend.validation.ValidPhone;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 25, message = "用户名长度必须在3-25之间")
    @Column(unique = true, nullable = false, length = 25)
    private String username;

    @NotBlank(message = "手机号不能为空")
    @ValidPhone
    @Column(unique = true, nullable = false, length = 11)
    private String phone;

    @NotBlank(message = "密码不能为空")
    @Column(nullable = false)
    private String password;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String avatar;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

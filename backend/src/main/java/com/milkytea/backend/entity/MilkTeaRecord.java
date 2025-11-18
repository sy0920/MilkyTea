package com.milkytea.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "milk_tea_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilkTeaRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @NotBlank(message = "品类不能为空")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "甜度不能为空")
    @Column(nullable = false)
    private String sweetness;

    @NotBlank(message = "冰度不能为空")
    @Column(nullable = false)
    private String iceLevel;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.0", message = "价格必须大于0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(value = 0, message = "评分最小为0")
    @Max(value = 10, message = "评分最大为10")
    @Column(nullable = false)
    private Integer rating;

    @Column(length = 500)
    private String comment;

    @Column(name = "consume_date", nullable = false)
    private LocalDate consumeDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (consumeDate == null) {
            consumeDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

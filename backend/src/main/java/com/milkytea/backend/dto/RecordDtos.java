package com.milkytea.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class RecordDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "创建奶茶记录请求")
    public static class CreateRecordRequest {
        @NotNull(message = "品牌ID不能为空")
        @Schema(description = "品牌ID", example = "1")
        private Long brandId;

        @NotBlank(message = "品类不能为空")
        @Schema(description = "品类", example = "波霸奶茶")
        private String category;

        @NotBlank(message = "甜度不能为空")
        @Schema(description = "甜度", example = "半糖")
        private String sweetness;

        @NotBlank(message = "冰度不能为空")
        @Schema(description = "冰度", example = "少冰")
        private String iceLevel;

        @NotNull(message = "价格不能为空")
        @DecimalMin(value = "0.0", message = "价格必须大于0")
        @Schema(description = "价格", example = "18.00")
        private BigDecimal price;

        @NotNull(message = "评分不能为空")
        @Min(value = 0, message = "评分最小为0")
        @Max(value = 10, message = "评分最大为10")
        @Schema(description = "评分(0-10)", example = "8")
        private Integer rating;

        @Schema(description = "评语", example = "很好喝")
        private String comment;

        @Schema(description = "消费日期", example = "2025-11-18")
        private LocalDate consumeDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "更新奶茶记录请求")
    public static class UpdateRecordRequest {
        @Schema(description = "品牌ID", example = "1")
        private Long brandId;

        @Schema(description = "品类", example = "波霸奶茶")
        private String category;

        @Schema(description = "甜度", example = "半糖")
        private String sweetness;

        @Schema(description = "冰度", example = "少冰")
        private String iceLevel;

        @DecimalMin(value = "0.0", message = "价格必须大于0")
        @Schema(description = "价格", example = "18.00")
        private BigDecimal price;

        @Min(value = 0, message = "评分最小为0")
        @Max(value = 10, message = "评分最大为10")
        @Schema(description = "评分(0-10)", example = "8")
        private Integer rating;

        @Schema(description = "评语", example = "很好喝")
        private String comment;

        @Schema(description = "消费日期", example = "2025-11-18")
        private LocalDate consumeDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "奶茶记录响应")
    public static class RecordResponse {
        @Schema(description = "记录ID")
        private Long id;

        @Schema(description = "品牌ID")
        private Long brandId;

        @Schema(description = "品牌名称")
        private String brandName;

        @Schema(description = "品类")
        private String category;

        @Schema(description = "甜度")
        private String sweetness;

        @Schema(description = "冰度")
        private String iceLevel;

        @Schema(description = "价格")
        private BigDecimal price;

        @Schema(description = "评分")
        private Integer rating;

        @Schema(description = "评语")
        private String comment;

        @Schema(description = "消费日期")
        private LocalDate consumeDate;

        @Schema(description = "创建时间")
        private LocalDateTime createdAt;

        @Schema(description = "更新时间")
        private LocalDateTime updatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "批量删除请求")
    public static class BatchDeleteRequest {
        @NotNull(message = "ID列表不能为空")
        @Schema(description = "要删除的记录ID列表", example = "[1, 2, 3]")
        private List<Long> ids;
    }
}

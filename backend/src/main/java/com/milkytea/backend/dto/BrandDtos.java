package com.milkytea.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class BrandDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "创建品牌请求")
    public static class CreateBrandRequest {
        @NotBlank(message = "品牌名称不能为空")
        @Schema(description = "品牌名称", example = "喜茶")
        private String name;

        @Schema(description = "品牌描述", example = "灵感之茶")
        private String description;

        @Schema(description = "品牌Logo URL", example = "https://example.com/logo.png")
        private String logoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "品牌响应")
    public static class BrandResponse {
        @Schema(description = "品牌ID")
        private Long id;

        @Schema(description = "品牌名称")
        private String name;

        @Schema(description = "品牌描述")
        private String description;

        @Schema(description = "品牌Logo URL")
        private String logoUrl;

        @Schema(description = "创建时间")
        private LocalDateTime createdAt;

        @Schema(description = "更新时间")
        private LocalDateTime updatedAt;
    }
}

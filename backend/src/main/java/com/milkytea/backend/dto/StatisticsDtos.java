package com.milkytea.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class StatisticsDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "基础统计响应")
    public static class SummaryResponse {
        @Schema(description = "总杯数")
        private Long totalCups;

        @Schema(description = "消费天数")
        private Long totalDays;

        @Schema(description = "累计消费金额")
        private BigDecimal totalAmount;

        @Schema(description = "平均单价")
        private BigDecimal averagePrice;

        @Schema(description = "最高单价")
        private BigDecimal maxPrice;

        @Schema(description = "最低单价")
        private BigDecimal minPrice;

        @Schema(description = "平均评分")
        private Double averageRating;

        @Schema(description = "统计周期开始日期")
        private LocalDate startDate;

        @Schema(description = "统计周期结束日期")
        private LocalDate endDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "品牌统计项")
    public static class BrandStatistics {
        @Schema(description = "品牌ID")
        private Long brandId;

        @Schema(description = "品牌名称")
        private String brandName;

        @Schema(description = "消费杯数")
        private Long count;

        @Schema(description = "消费金额")
        private BigDecimal amount;

        @Schema(description = "平均评分")
        private Double averageRating;

        @Schema(description = "占比")
        private Double percentage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "品牌统计响应")
    public static class BrandStatisticsResponse {
        @Schema(description = "品牌统计列表")
        private List<BrandStatistics> statistics;

        @Schema(description = "统计周期开始日期")
        private LocalDate startDate;

        @Schema(description = "统计周期结束日期")
        private LocalDate endDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "日历数据项")
    public static class CalendarDay {
        @Schema(description = "日期")
        private LocalDate date;

        @Schema(description = "消费杯数")
        private Integer count;

        @Schema(description = "消费金额")
        private BigDecimal amount;

        @Schema(description = "是否有消费")
        private Boolean hasConsumption;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "日历月度数据响应")
    public static class CalendarMonthResponse {
        @Schema(description = "年份")
        private Integer year;

        @Schema(description = "月份")
        private Integer month;

        @Schema(description = "每日数据")
        private List<CalendarDay> days;

        @Schema(description = "本月总杯数")
        private Long totalCups;

        @Schema(description = "本月总金额")
        private BigDecimal totalAmount;

        @Schema(description = "本月消费天数")
        private Long consumeDays;
    }
}

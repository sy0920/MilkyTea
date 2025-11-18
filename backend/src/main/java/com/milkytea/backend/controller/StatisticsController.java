package com.milkytea.backend.controller;

import com.milkytea.backend.dto.StatisticsDtos;
import com.milkytea.backend.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "统计分析", description = "消费统计分析相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/summary")
    @Operation(summary = "获取基础统计", description = "获取指定时间段的基础统计数据")
    public ResponseEntity<StatisticsDtos.SummaryResponse> getSummary(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String username = authentication.getName();
        StatisticsDtos.SummaryResponse response = statisticsService.getSummary(username, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/brands")
    @Operation(summary = "获取品牌统计", description = "获取指定时间段的品牌统计数据")
    public ResponseEntity<StatisticsDtos.BrandStatisticsResponse> getBrandStatistics(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String username = authentication.getName();
        StatisticsDtos.BrandStatisticsResponse response = statisticsService.getBrandStatistics(
                username, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calendar/{year}/{month}")
    @Operation(summary = "获取日历月度数据", description = "获取指定年月的日历消费数据")
    public ResponseEntity<StatisticsDtos.CalendarMonthResponse> getCalendarData(
            Authentication authentication,
            @PathVariable int year,
            @PathVariable int month) {
        String username = authentication.getName();
        StatisticsDtos.CalendarMonthResponse response = statisticsService.getCalendarData(username, year, month);
        return ResponseEntity.ok(response);
    }
}

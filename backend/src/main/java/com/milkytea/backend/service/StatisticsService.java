package com.milkytea.backend.service;

import com.milkytea.backend.dto.StatisticsDtos;
import com.milkytea.backend.entity.MilkTeaRecord;
import com.milkytea.backend.entity.User;
import com.milkytea.backend.repository.MilkTeaRecordRepository;
import com.milkytea.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final MilkTeaRecordRepository recordRepository;
    private final UserRepository userRepository;

    public StatisticsDtos.SummaryResponse getSummary(String username, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<MilkTeaRecord> records = recordRepository.findByUserAndConsumeDateBetweenOrderByConsumeDateDesc(
                user, startDate, endDate);

        long totalCups = records.size();
        long totalDays = recordRepository.countDistinctDaysByUserAndConsumeDateBetween(user, startDate, endDate);

        BigDecimal totalAmount = records.stream()
                .map(MilkTeaRecord::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averagePrice = totalCups > 0
                ? totalAmount.divide(BigDecimal.valueOf(totalCups), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Optional<BigDecimal> maxPrice = records.stream()
                .map(MilkTeaRecord::getPrice)
                .max(BigDecimal::compareTo);

        Optional<BigDecimal> minPrice = records.stream()
                .map(MilkTeaRecord::getPrice)
                .min(BigDecimal::compareTo);

        double averageRating = records.stream()
                .mapToInt(MilkTeaRecord::getRating)
                .average()
                .orElse(0.0);

        return new StatisticsDtos.SummaryResponse(
                totalCups,
                totalDays,
                totalAmount,
                averagePrice,
                maxPrice.orElse(BigDecimal.ZERO),
                minPrice.orElse(BigDecimal.ZERO),
                averageRating,
                startDate,
                endDate);
    }

    public StatisticsDtos.BrandStatisticsResponse getBrandStatistics(
            String username, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        List<MilkTeaRecord> records = recordRepository.findByUserAndConsumeDateBetweenOrderByConsumeDateDesc(
                user, startDate, endDate);

        long totalCount = records.size();

        Map<Long, List<MilkTeaRecord>> groupedByBrand = records.stream()
                .collect(Collectors.groupingBy(r -> r.getBrand().getId()));

        List<StatisticsDtos.BrandStatistics> statistics = groupedByBrand.entrySet().stream()
                .map(entry -> {
                    List<MilkTeaRecord> brandRecords = entry.getValue();
                    Long brandId = entry.getKey();
                    String brandName = brandRecords.get(0).getBrand().getName();
                    long count = brandRecords.size();

                    BigDecimal amount = brandRecords.stream()
                            .map(MilkTeaRecord::getPrice)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    double averageRating = brandRecords.stream()
                            .mapToInt(MilkTeaRecord::getRating)
                            .average()
                            .orElse(0.0);

                    double percentage = totalCount > 0
                            ? (double) count / totalCount * 100
                            : 0.0;

                    return new StatisticsDtos.BrandStatistics(
                            brandId,
                            brandName,
                            count,
                            amount,
                            averageRating,
                            percentage);
                })
                .sorted(Comparator.comparing(StatisticsDtos.BrandStatistics::getCount).reversed())
                .collect(Collectors.toList());

        return new StatisticsDtos.BrandStatisticsResponse(statistics, startDate, endDate);
    }

    public StatisticsDtos.CalendarMonthResponse getCalendarData(String username, int year, int month) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        List<MilkTeaRecord> records = recordRepository.findByUserAndYearAndMonth(user, year, month);

        YearMonth yearMonth = YearMonth.of(year, month);
        int daysInMonth = yearMonth.lengthOfMonth();

        Map<LocalDate, List<MilkTeaRecord>> recordsByDate = records.stream()
                .collect(Collectors.groupingBy(MilkTeaRecord::getConsumeDate));

        List<StatisticsDtos.CalendarDay> days = new ArrayList<>();
        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate date = LocalDate.of(year, month, day);
            List<MilkTeaRecord> dayRecords = recordsByDate.getOrDefault(date, Collections.emptyList());

            int count = dayRecords.size();
            BigDecimal amount = dayRecords.stream()
                    .map(MilkTeaRecord::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            days.add(new StatisticsDtos.CalendarDay(
                    date,
                    count,
                    amount,
                    !dayRecords.isEmpty()));
        }

        long totalCups = records.size();
        BigDecimal totalAmount = records.stream()
                .map(MilkTeaRecord::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long consumeDays = recordsByDate.size();

        return new StatisticsDtos.CalendarMonthResponse(
                year,
                month,
                days,
                totalCups,
                totalAmount,
                consumeDays);
    }
}

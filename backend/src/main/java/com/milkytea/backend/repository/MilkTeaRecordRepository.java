package com.milkytea.backend.repository;

import com.milkytea.backend.entity.MilkTeaRecord;
import com.milkytea.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MilkTeaRecordRepository extends JpaRepository<MilkTeaRecord, Long> {

    List<MilkTeaRecord> findByUserOrderByConsumeDateDesc(User user);

    List<MilkTeaRecord> findByUserAndConsumeDateBetweenOrderByConsumeDateDesc(
            User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT r FROM MilkTeaRecord r WHERE r.user = :user AND " +
            "YEAR(r.consumeDate) = :year AND MONTH(r.consumeDate) = :month " +
            "ORDER BY r.consumeDate DESC")
    List<MilkTeaRecord> findByUserAndYearAndMonth(
            @Param("user") User user,
            @Param("year") int year,
            @Param("month") int month);

    long countByUserAndConsumeDateBetween(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(DISTINCT r.consumeDate) FROM MilkTeaRecord r " +
            "WHERE r.user = :user AND r.consumeDate BETWEEN :startDate AND :endDate")
    long countDistinctDaysByUserAndConsumeDateBetween(
            @Param("user") User user,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

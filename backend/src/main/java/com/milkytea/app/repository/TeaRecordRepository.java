package com.milkytea.app.repository;

import com.milkytea.app.model.TeaRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TeaRecordRepository extends JpaRepository<TeaRecord, Long> {
    
    List<TeaRecord> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(t) FROM TeaRecord t WHERE t.createdAt >= :start")
    Long countByCreatedAtAfter(LocalDateTime start);
}

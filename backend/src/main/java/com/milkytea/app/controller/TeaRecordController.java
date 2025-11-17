package com.milkytea.app.controller;

import com.milkytea.app.dto.StatisticsDTO;
import com.milkytea.app.dto.TeaRecordDTO;
import com.milkytea.app.model.TeaRecord;
import com.milkytea.app.repository.TeaRecordRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tea-records")
@CrossOrigin(origins = "*")
public class TeaRecordController {

    @Autowired
    private TeaRecordRepository teaRecordRepository;

    @GetMapping
    public List<TeaRecordDTO> getAllRecords() {
        return teaRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeaRecordDTO> getRecordById(@PathVariable Long id) {
        return teaRecordRepository.findById(id)
                .map(record -> ResponseEntity.ok(convertToDTO(record)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TeaRecordDTO createRecord(@RequestBody TeaRecordDTO recordDTO) {
        TeaRecord record = convertToEntity(recordDTO);
        TeaRecord savedRecord = teaRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeaRecordDTO> updateRecord(@PathVariable Long id, 
                                                      @RequestBody TeaRecordDTO recordDTO) {
        return teaRecordRepository.findById(id)
                .map(record -> {
                    record.setBrand(recordDTO.getBrand());
                    record.setCategory(recordDTO.getCategory());
                    record.setSweetness(recordDTO.getSweetness());
                    record.setIceLevel(recordDTO.getIceLevel());
                    record.setPrice(recordDTO.getPrice());
                    record.setRating(recordDTO.getRating());
                    record.setComment(recordDTO.getComment());
                    TeaRecord updatedRecord = teaRecordRepository.save(record);
                    return ResponseEntity.ok(convertToDTO(updatedRecord));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        return teaRecordRepository.findById(id)
                .map(record -> {
                    teaRecordRepository.delete(record);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/statistics")
    public StatisticsDTO getStatistics() {
        List<TeaRecord> allRecords = teaRecordRepository.findAll();
        
        Long totalCount = (long) allRecords.size();
        
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Long recentCount = teaRecordRepository.countByCreatedAtAfter(sevenDaysAgo);
        
        Double totalSpent = allRecords.stream()
                .mapToDouble(TeaRecord::getPrice)
                .sum();
        
        Double averageRating = allRecords.isEmpty() ? 0.0 : allRecords.stream()
                .mapToDouble(TeaRecord::getRating)
                .average()
                .orElse(0.0);
        
        String favoriteBrand = allRecords.isEmpty() ? "N/A" : allRecords.stream()
                .collect(Collectors.groupingBy(TeaRecord::getBrand, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
        
        return new StatisticsDTO(totalCount, recentCount, totalSpent, averageRating, favoriteBrand);
    }

    private TeaRecordDTO convertToDTO(TeaRecord record) {
        TeaRecordDTO dto = new TeaRecordDTO();
        BeanUtils.copyProperties(record, dto);
        return dto;
    }

    private TeaRecord convertToEntity(TeaRecordDTO dto) {
        TeaRecord record = new TeaRecord();
        BeanUtils.copyProperties(dto, record);
        return record;
    }
}

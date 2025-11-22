package com.milkytea.backend.controller;

import com.milkytea.backend.dto.RecordDtos;
import com.milkytea.backend.service.RecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@Tag(name = "奶茶记录管理", description = "奶茶消费记录相关接口")
@SecurityRequirement(name = "Bearer Authentication")
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    @Operation(summary = "创建记录", description = "创建新的奶茶消费记录")
    public ResponseEntity<RecordDtos.RecordResponse> createRecord(
            Authentication authentication,
            @Valid @RequestBody RecordDtos.CreateRecordRequest request) {
        String username = authentication.getName();
        RecordDtos.RecordResponse response = recordService.createRecord(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "获取记录列表", description = "获取当前用户的奶茶消费记录，支持按日期/品牌/品类筛选")
    public ResponseEntity<List<RecordDtos.RecordResponse>> getRecords(
            Authentication authentication,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        String username = authentication.getName();
        List<RecordDtos.RecordResponse> response = recordService.getUserRecords(
                username, date, startDate, endDate, brandId, category, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取记录详情", description = "根据ID获取奶茶消费记录详情")
    public ResponseEntity<RecordDtos.RecordResponse> getRecord(
            Authentication authentication,
            @PathVariable Long id) {
        String username = authentication.getName();
        RecordDtos.RecordResponse response = recordService.getRecordById(username, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新记录", description = "更新已存在的奶茶消费记录")
    public ResponseEntity<RecordDtos.RecordResponse> updateRecord(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody RecordDtos.UpdateRecordRequest request) {
        String username = authentication.getName();
        RecordDtos.RecordResponse response = recordService.updateRecord(username, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除记录", description = "删除指定的奶茶消费记录")
    public ResponseEntity<Void> deleteRecord(
            Authentication authentication,
            @PathVariable Long id) {
        String username = authentication.getName();
        recordService.deleteRecord(username, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch-delete")
    @Operation(summary = "批量删除记录", description = "批量删除当前用户的多条奶茶消费记录")
    public ResponseEntity<Void> batchDeleteRecords(
            Authentication authentication,
            @Valid @RequestBody RecordDtos.BatchDeleteRequest request) {
        String username = authentication.getName();
        recordService.batchDeleteRecords(username, request.getIds());
        return ResponseEntity.noContent().build();
    }
}

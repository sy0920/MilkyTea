package com.milkytea.backend.controller;

import com.milkytea.backend.dto.BrandDtos;
import com.milkytea.backend.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@Tag(name = "品牌管理", description = "奶茶品牌相关接口")
public class BrandController {

    private final BrandService brandService;

    @PostMapping
    @Operation(summary = "创建品牌", description = "创建新的奶茶品牌")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<BrandDtos.BrandResponse> createBrand(
            @Valid @RequestBody BrandDtos.CreateBrandRequest request) {
        BrandDtos.BrandResponse response = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "获取所有品牌", description = "获取所有奶茶品牌列表")
    public ResponseEntity<List<BrandDtos.BrandResponse>> getAllBrands() {
        List<BrandDtos.BrandResponse> response = brandService.getAllBrands();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取品牌详情", description = "根据ID获取品牌详情")
    public ResponseEntity<BrandDtos.BrandResponse> getBrand(@PathVariable Long id) {
        BrandDtos.BrandResponse response = brandService.getBrandById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除品牌", description = "根据ID删除品牌")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}

package com.milkytea.backend.service;

import com.milkytea.backend.dto.BrandDtos;
import com.milkytea.backend.entity.Brand;
import com.milkytea.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Transactional
    public BrandDtos.BrandResponse createBrand(BrandDtos.CreateBrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw new RuntimeException("品牌名称已存在");
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());

        brand = brandRepository.save(brand);

        return convertToResponse(brand);
    }

    public List<BrandDtos.BrandResponse> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BrandDtos.BrandResponse getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("品牌不存在"));
        return convertToResponse(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("品牌不存在");
        }
        brandRepository.deleteById(id);
    }

    private BrandDtos.BrandResponse convertToResponse(Brand brand) {
        return new BrandDtos.BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getDescription(),
                brand.getLogoUrl(),
                brand.getCreatedAt(),
                brand.getUpdatedAt());
    }
}

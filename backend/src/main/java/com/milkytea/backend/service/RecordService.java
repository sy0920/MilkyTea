package com.milkytea.backend.service;

import com.milkytea.backend.dto.RecordDtos;
import com.milkytea.backend.entity.Brand;
import com.milkytea.backend.entity.MilkTeaRecord;
import com.milkytea.backend.entity.User;
import com.milkytea.backend.repository.BrandRepository;
import com.milkytea.backend.repository.MilkTeaRecordRepository;
import com.milkytea.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final MilkTeaRecordRepository recordRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;

    @Transactional
    public RecordDtos.RecordResponse createRecord(String username, RecordDtos.CreateRecordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new RuntimeException("品牌不存在"));

        MilkTeaRecord record = new MilkTeaRecord();
        record.setUser(user);
        record.setBrand(brand);
        record.setCategory(request.getCategory());
        record.setSweetness(request.getSweetness());
        record.setIceLevel(request.getIceLevel());
        record.setPrice(request.getPrice());
        record.setRating(request.getRating());
        record.setComment(request.getComment());
        record.setConsumeDate(request.getConsumeDate() != null ? request.getConsumeDate() : LocalDate.now());

        record = recordRepository.save(record);

        return convertToResponse(record);
    }

    public List<RecordDtos.RecordResponse> getUserRecords(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        return recordRepository.findByUserOrderByConsumeDateDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RecordDtos.RecordResponse getRecordById(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        MilkTeaRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("记录不存在"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("无权访问该记录");
        }

        return convertToResponse(record);
    }

    @Transactional
    public RecordDtos.RecordResponse updateRecord(String username, Long id, RecordDtos.UpdateRecordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        MilkTeaRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("记录不存在"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("无权修改该记录");
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("品牌不存在"));
            record.setBrand(brand);
        }

        if (request.getCategory() != null) {
            record.setCategory(request.getCategory());
        }
        if (request.getSweetness() != null) {
            record.setSweetness(request.getSweetness());
        }
        if (request.getIceLevel() != null) {
            record.setIceLevel(request.getIceLevel());
        }
        if (request.getPrice() != null) {
            record.setPrice(request.getPrice());
        }
        if (request.getRating() != null) {
            record.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            record.setComment(request.getComment());
        }
        if (request.getConsumeDate() != null) {
            record.setConsumeDate(request.getConsumeDate());
        }

        record = recordRepository.save(record);

        return convertToResponse(record);
    }

    @Transactional
    public void deleteRecord(String username, Long id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        MilkTeaRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("记录不存在"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("无权删除该记录");
        }

        recordRepository.delete(record);
    }

    private RecordDtos.RecordResponse convertToResponse(MilkTeaRecord record) {
        return new RecordDtos.RecordResponse(
                record.getId(),
                record.getBrand().getId(),
                record.getBrand().getName(),
                record.getCategory(),
                record.getSweetness(),
                record.getIceLevel(),
                record.getPrice(),
                record.getRating(),
                record.getComment(),
                record.getConsumeDate(),
                record.getCreatedAt(),
                record.getUpdatedAt());
    }
}

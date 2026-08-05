package com.rentlens.service;

import com.rentlens.dto.InquiryDTO;
import com.rentlens.model.Inquiry;
import com.rentlens.model.Property;
import com.rentlens.repository.InquiryRepository;
import com.rentlens.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PropertyRepository propertyRepository;

    @Transactional(readOnly = true)
    public List<InquiryDTO> getAll() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public InquiryDTO create(InquiryDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new EntityNotFoundException("Property not found: " + dto.getPropertyId()));

        Inquiry inquiry = Inquiry.builder()
                .property(property)
                .senderName(dto.getSenderName())
                .senderEmail(dto.getSenderEmail())
                .message(dto.getMessage())
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(inquiryRepository.save(inquiry));
    }

    @Transactional
    public void delete(Long id) {
        if (!inquiryRepository.existsById(id)) {
            throw new EntityNotFoundException("Inquiry not found: " + id);
        }
        inquiryRepository.deleteById(id);
    }

    private InquiryDTO toDTO(Inquiry inquiry) {
        return InquiryDTO.builder()
                .id(inquiry.getId())
                .propertyId(inquiry.getProperty().getId())
                .propertyTitle(inquiry.getProperty().getTitle())
                .senderName(inquiry.getSenderName())
                .senderEmail(inquiry.getSenderEmail())
                .message(inquiry.getMessage())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}

package com.rentlens.service;

import com.rentlens.dto.ReviewDTO;
import com.rentlens.model.Property;
import com.rentlens.model.Review;
import com.rentlens.repository.PropertyRepository;
import com.rentlens.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository   reviewRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyService    propertyService;

    @Transactional(readOnly = true)
    public List<ReviewDTO> getByProperty(Long propertyId) {
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO create(ReviewDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new EntityNotFoundException("Property not found: " + dto.getPropertyId()));

        Review review = Review.builder()
                .property(property)
                .author(dto.getAuthor())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();
        review.setComplaintTagsList(dto.getComplaintTags());

        ReviewDTO saved = toDTO(reviewRepository.save(review));

        // Refresh property's rating aggregate and RVS after every new review
        propertyService.refreshReviewAggregates(dto.getPropertyId());

        return saved;
    }

    // ── DTO mapping ──────────────────────────────────────────────────────────────

    ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .propertyId(r.getProperty().getId())
                .author(r.getAuthor())
                .rating(r.getRating())
                .comment(r.getComment())
                .complaintTags(r.getComplaintTagsList())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

package com.rentlens.repository;

import com.rentlens.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId")
    Double avgRatingForProperty(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.property.id = :propertyId")
    long countByPropertyId(@Param("propertyId") Long propertyId);

    /**
     * Aggregate complaint tag frequencies across all reviews.
     * Returns raw complaintTagsRaw strings for manual parsing.
     */
    @Query("SELECT r.complaintTagsRaw FROM Review r WHERE r.complaintTagsRaw IS NOT NULL AND r.complaintTagsRaw <> ''")
    List<String> findAllComplaintTagsRaw();
}

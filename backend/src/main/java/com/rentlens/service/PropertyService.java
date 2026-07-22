package com.rentlens.service;

import com.rentlens.dto.PropertyDTO;
import com.rentlens.model.Property;
import com.rentlens.repository.PropertyRepository;
import com.rentlens.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final ReviewRepository   reviewRepository;
    private final RentScoreService   rentScoreService;

    // ── Read ─────────────────────────────────────────────────────────────────────

    /** Returns all properties matching optional filters, sorted by RVS desc. */
    @Transactional(readOnly = true)
    public List<PropertyDTO> getAll(String area, Integer minPrice, Integer maxPrice,
                                    Integer bedrooms, Double minRating) {
        List<Property> props = propertyRepository.findWithFilters(
                area, minPrice, maxPrice, bedrooms, minRating);
        return props.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PropertyDTO getById(Long id) {
        Property p = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found: " + id));
        return toDTO(p);
    }

    /** Returns properties within budget ranked by RVS descending. */
    @Transactional(readOnly = true)
    public List<PropertyDTO> recommend(int budget) {
        return propertyRepository.findByBudget(budget)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Returns multiple properties by IDs for side-by-side comparison. */
    @Transactional(readOnly = true)
    public List<PropertyDTO> compare(List<Long> ids) {
        return propertyRepository.findAllById(ids)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Create / Update / Delete ─────────────────────────────────────────────────

    @Transactional
    public PropertyDTO create(PropertyDTO dto) {
        Property property = fromDTO(dto);
        recalculateScore(property);
        return toDTO(propertyRepository.save(property));
    }

    @Transactional
    public PropertyDTO update(Long id, PropertyDTO dto) {
        Property existing = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found: " + id));

        applyDtoToEntity(dto, existing);
        recalculateScore(existing);
        return toDTO(propertyRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new EntityNotFoundException("Property not found: " + id);
        }
        propertyRepository.deleteById(id);
    }

    // ── Internal helpers ─────────────────────────────────────────────────────────

    /**
     * Recalculates RVS using all current market prices for context.
     * This is called before every save so the score stays accurate.
     */
    void recalculateScore(Property property) {
        List<Integer> allPrices = propertyRepository.findAll()
                .stream().map(Property::getPrice).collect(Collectors.toList());
        // Include the current property's price if it is new (not yet in DB)
        if (property.getPrice() != null) allPrices.add(property.getPrice());
        rentScoreService.computeAndApply(property, allPrices);
    }

    /** Recalculates review aggregates on the property (call after a review is saved). */
    @Transactional
    public void refreshReviewAggregates(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Property not found: " + propertyId));

        Double avgRating = reviewRepository.avgRatingForProperty(propertyId);
        long   count     = reviewRepository.countByPropertyId(propertyId);

        property.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        property.setReviewCount((int) count);
        recalculateScore(property);
        propertyRepository.save(property);
    }

    // ── DTO mapping ──────────────────────────────────────────────────────────────

    public PropertyDTO toDTO(Property p) {
        return PropertyDTO.builder()
                .id(p.getId())
                .title(p.getTitle())
                .area(p.getArea())
                .price(p.getPrice())
                .bedrooms(p.getBedrooms())
                .bathrooms(p.getBathrooms())
                .squareFeet(p.getSquareFeet())
                .distance(p.getDistance())
                .facilities(p.getFacilitiesList())
                .landlord(p.getLandlord())
                .phone(p.getPhone())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .verified(p.getVerified())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .postedDate(p.getPostedDate())
                .rentValueScore(p.getRentValueScore())
                .priceScore(p.getPriceScore())
                .distanceScore(p.getDistanceScore())
                .facilityScore(p.getFacilityScore())
                .reviewScore(p.getReviewScore())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .badge(RentScoreService.badge(p.getRentValueScore()))
                .build();
    }

    private Property fromDTO(PropertyDTO dto) {
        Property p = new Property();
        applyDtoToEntity(dto, p);
        return p;
    }

    private void applyDtoToEntity(PropertyDTO dto, Property p) {
        p.setTitle(dto.getTitle());
        p.setArea(dto.getArea());
        p.setPrice(dto.getPrice());
        p.setBedrooms(dto.getBedrooms());
        p.setBathrooms(dto.getBathrooms());
        p.setSquareFeet(dto.getSquareFeet());
        p.setDistance(dto.getDistance());
        p.setFacilitiesList(dto.getFacilities());
        p.setLandlord(dto.getLandlord());
        p.setPhone(dto.getPhone());
        p.setDescription(dto.getDescription());
        p.setImageUrl(dto.getImageUrl());
        p.setVerified(dto.getVerified() != null ? dto.getVerified() : false);
        p.setLatitude(dto.getLatitude());
        p.setLongitude(dto.getLongitude());
        p.setPostedDate(dto.getPostedDate());
    }
}

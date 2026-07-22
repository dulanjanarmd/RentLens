package com.rentlens.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object for Property — used for both request and response payloads.
 * Includes computed RVS sub-scores and badge for the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDTO {

    private Long   id;
    private String title;
    private String area;
    private Integer price;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer squareFeet;
    private Double  distance;

    /** List of facility strings e.g. ["WiFi", "Parking", "AC"] */
    private List<String> facilities;

    private String  landlord;
    private String  phone;
    private String  description;
    private String  imageUrl;
    private Boolean verified;
    private Double  latitude;
    private Double  longitude;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate postedDate;

    // ── Computed RVS fields ──────────────────────────────────────────────────────
    private Double rentValueScore;
    private Double priceScore;
    private Double distanceScore;
    private Double facilityScore;
    private Double reviewScore;

    // ── Review aggregates ────────────────────────────────────────────────────────
    private Double  rating;
    private Integer reviewCount;

    /** "green" | "amber" | "red" (SRS §5.1) */
    private String badge;
}

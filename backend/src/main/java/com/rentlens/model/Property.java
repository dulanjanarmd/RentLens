package com.rentlens.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Core entity representing a rental property listing.
 *
 * Hibernate creates/updates the `properties` table automatically on startup.
 * The rentValueScore field is stored as a computed column (set by RentScoreService)
 * so every save/update recalculates the score.
 */
@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Area is required")
    @Column(nullable = false)
    private String area;

    /** Monthly rent in LKR */
    @NotNull
    @Min(value = 1000, message = "Price must be at least 1000 LKR")
    @Column(nullable = false)
    private Integer price;

    @Min(1)
    @Max(20)
    private Integer bedrooms;

    @Min(1)
    private Integer bathrooms;

    private Integer squareFeet;

    /** Distance to nearest university/transport hub in km */
    private Double distance;

    /**
     * Comma-separated list of facilities stored as a single column.
     * Example: "WiFi,Parking,AC,Water Tank"
     */
    @Column(length = 1000)
    private String facilitiesRaw;

    /** Contact name of the landlord */
    private String landlord;

    /** Landlord phone number */
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** URL of the primary property image */
    @Column(length = 1000)
    private String imageUrl;

    /** Whether the landlord/listing has been admin-verified */
    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    /** Latitude for map pin (area-level approximate for Phase 1) */
    private Double latitude;

    /** Longitude for map pin */
    private Double longitude;

    /** Date the listing was posted */
    private LocalDate postedDate;

    // ─── Computed / cached score fields ────────────────────────────────────────
    // Stored in DB so they can be queried/sorted; recalculated by RentScoreService on save.

    /** Rental Value Score (0–100): RVS = 0.35×Price + 0.25×Distance + 0.20×Facility + 0.20×Review */
    @Column(nullable = false)
    @Builder.Default
    private Double rentValueScore = 0.0;

    /** Price sub-score (0–100) */
    @Builder.Default
    private Double priceScore = 0.0;

    /** Distance sub-score (0–100) */
    @Builder.Default
    private Double distanceScore = 0.0;

    /** Facility sub-score (0–100) */
    @Builder.Default
    private Double facilityScore = 0.0;

    // ─── Denormalized review aggregates (updated whenever a review is saved) ───
    /** Aggregated rating from reviews (0–5) */
    @Builder.Default
    private Double rating = 0.0;

    /** Total number of reviews */
    @Builder.Default
    private Integer reviewCount = 0;

    /** Review sub-score used in RVS (0–100), derived from rating */
    @Builder.Default
    private Double reviewScore = 0.0;

    // ─── Transient helpers ──────────────────────────────────────────────────────
    @Transient
    public List<String> getFacilitiesList() {
        if (facilitiesRaw == null || facilitiesRaw.isBlank()) return List.of();
        return List.of(facilitiesRaw.split(","));
    }

    public void setFacilitiesList(List<String> facilities) {
        this.facilitiesRaw = facilities == null ? "" : String.join(",", facilities);
    }
}

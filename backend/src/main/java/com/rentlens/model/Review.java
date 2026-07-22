package com.rentlens.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a tenant review on a rental property.
 *
 * Hibernate creates/updates the `reviews` table automatically.
 */
@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Many reviews → one property */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @NotBlank(message = "Author name is required")
    private String author;

    @Min(1)
    @Max(5)
    @NotNull
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    /**
     * Comma-separated complaint tags.
     * Allowed values: water_issues, noise, maintenance_delays,
     *                 landlord_unresponsive, overcrowding, power_issues
     */
    @Column(length = 500)
    private String complaintTagsRaw;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // ─── Transient helpers ───────────────────────────────────────────────────────
    @Transient
    public List<String> getComplaintTagsList() {
        if (complaintTagsRaw == null || complaintTagsRaw.isBlank()) return List.of();
        return List.of(complaintTagsRaw.split(","));
    }

    public void setComplaintTagsList(List<String> tags) {
        this.complaintTagsRaw = tags == null ? "" : String.join(",", tags);
    }
}

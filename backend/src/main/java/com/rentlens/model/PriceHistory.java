package com.rentlens.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "price_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private Integer averagePrice;

    @Column(nullable = false)
    private Integer medianPrice;

    // Order field to help sorting chronologically
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}

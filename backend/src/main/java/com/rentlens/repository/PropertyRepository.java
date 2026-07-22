package com.rentlens.repository;

import com.rentlens.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // ─── Filtering ────────────────────────────────────────────────────────────────

    List<Property> findByAreaIgnoreCase(String area);

    List<Property> findByPriceBetween(int minPrice, int maxPrice);

    List<Property> findByBedrooms(int bedrooms);

    List<Property> findByRatingGreaterThanEqual(double minRating);

    /**
     * Flexible filter: all optional params; null means "any".
     */
    @Query("""
        SELECT p FROM Property p
        WHERE (:area IS NULL OR LOWER(p.area) = LOWER(:area))
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
          AND (:bedrooms IS NULL OR p.bedrooms = :bedrooms)
          AND (:minRating IS NULL OR p.rating >= :minRating)
        ORDER BY p.rentValueScore DESC
        """)
    List<Property> findWithFilters(
            @Param("area") String area,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("minRating") Double minRating
    );

    // ─── Budget-based recommendation ─────────────────────────────────────────────

    /** Properties within budget, ranked by RVS descending. */
    @Query("SELECT p FROM Property p WHERE p.price <= :budget ORDER BY p.rentValueScore DESC")
    List<Property> findByBudget(@Param("budget") int budget);

    // ─── Analytics ───────────────────────────────────────────────────────────────

    @Query("SELECT p.area, AVG(p.price), COUNT(p), AVG(p.rating) FROM Property p GROUP BY p.area")
    List<Object[]> getAreaStats();

    @Query("SELECT COUNT(p) FROM Property p")
    long countAll();
}

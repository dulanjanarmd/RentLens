package com.rentlens.service;

import com.rentlens.model.Property;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  RentScoreService  —  Core business rule (SRS §4.2)
 * ═══════════════════════════════════════════════════════════════════
 *
 * Rental Value Score formula (authoritative, from SRS §4.2):
 *
 *   RVS = 0.35 × PriceScore
 *       + 0.25 × DistanceScore
 *       + 0.20 × FacilityScore
 *       + 0.20 × ReviewScore
 *
 * Each sub-score is normalised to [0, 100].
 *
 * This service is deliberately isolated from persistence and controller
 * logic so that weight changes never require touching other layers
 * (SRS §6.6 NFR-MAINT-01).
 *
 * Badge colours (SRS §5.1):
 *   green  ≥ 70
 *   amber  45 – 69
 *   red    < 45
 */
@Service
public class RentScoreService {

    // ── Weights (SRS §4.2) ───────────────────────────────────────────────────────
    private static final double W_PRICE    = 0.35;
    private static final double W_DISTANCE = 0.25;
    private static final double W_FACILITY = 0.20;
    private static final double W_REVIEW   = 0.20;

    // ── Price normalisation parameters ───────────────────────────────────────────
    /** Price at or below this is considered maximum value (score 100). */
    private static final int PRICE_FLOOR = 15_000;   // LKR
    /** Price at or above this is considered minimum value (score 0). */
    private static final int PRICE_CEIL  = 150_000;  // LKR

    // ── Distance normalisation parameters ────────────────────────────────────────
    /** 0 km from university = perfect score. */
    private static final double DIST_BEST = 0.0;   // km
    /** 10 km+ = score 0. */
    private static final double DIST_WORST = 10.0; // km

    // ── Facility normalisation ───────────────────────────────────────────────────
    /**
     * Reference set of valued facilities.
     * Score = (matched / FACILITY_MAX) * 100, capped at 100.
     */
    private static final int FACILITY_MAX = 6;

    /**
     * Computes and stores all sub-scores and the final RVS on the property object.
     * Call this before every save so the DB always holds up-to-date values.
     *
     * @param property       The property to score (mutated in-place).
     * @param marketPrices   All current listing prices — used for market-relative scoring.
     *                       May be empty; falls back to absolute normalisation.
     */
    public void computeAndApply(Property property, Collection<Integer> marketPrices) {
        double priceScore    = computePriceScore(property.getPrice(), marketPrices);
        double distanceScore = computeDistanceScore(property.getDistance());
        double facilityScore = computeFacilityScore(property.getFacilitiesList().size());
        double reviewScore   = computeReviewScore(property.getRating());

        double rvs = W_PRICE    * priceScore
                   + W_DISTANCE * distanceScore
                   + W_FACILITY * facilityScore
                   + W_REVIEW   * reviewScore;

        property.setPriceScore(round2(priceScore));
        property.setDistanceScore(round2(distanceScore));
        property.setFacilityScore(round2(facilityScore));
        property.setReviewScore(round2(reviewScore));
        property.setRentValueScore(round2(rvs));
    }

    // ── Sub-score calculators ─────────────────────────────────────────────────────

    /**
     * Price Score: lower price relative to market = higher score.
     *
     * If market prices are available, uses percentile ranking (score = percent of
     * listings that are MORE expensive than this property).
     * Falls back to linear normalisation between PRICE_FLOOR and PRICE_CEIL.
     *
     * Graceful degradation (SRS §6.4 NFR-REL-01): if price is null, returns 50.
     */
    double computePriceScore(Integer price, Collection<Integer> marketPrices) {
        if (price == null) return 50.0; // neutral default

        if (marketPrices != null && marketPrices.size() > 1) {
            long cheaperCount = marketPrices.stream().filter(p -> p > price).count();
            return clamp((double) cheaperCount / marketPrices.size() * 100.0);
        }

        // Absolute fallback: linear interpolation
        // price at FLOOR → 100, price at CEIL → 0
        if (price <= PRICE_FLOOR) return 100.0;
        if (price >= PRICE_CEIL)  return 0.0;
        return clamp((double)(PRICE_CEIL - price) / (PRICE_CEIL - PRICE_FLOOR) * 100.0);
    }

    /**
     * Distance Score: closer = better.
     * Linear from 100 (0 km) to 0 (DIST_WORST km+).
     * Graceful default: null distance → 50.
     */
    double computeDistanceScore(Double distance) {
        if (distance == null) return 50.0;
        if (distance <= DIST_BEST)  return 100.0;
        if (distance >= DIST_WORST) return 0.0;
        return clamp((DIST_WORST - distance) / (DIST_WORST - DIST_BEST) * 100.0);
    }

    /**
     * Facility Score: more facilities = higher score, capped at FACILITY_MAX reference.
     */
    double computeFacilityScore(int facilityCount) {
        return clamp((double) facilityCount / FACILITY_MAX * 100.0);
    }

    /**
     * Review Score: derived from average star rating (0–5).
     * Maps [0,5] → [0,100] linearly.
     * Graceful default: null/0 rating → 50 (neutral).
     */
    double computeReviewScore(Double rating) {
        if (rating == null || rating == 0.0) return 50.0;
        return clamp(rating / 5.0 * 100.0);
    }

    // ── Badge label ──────────────────────────────────────────────────────────────

    /** Returns "green", "amber", or "red" per SRS §5.1. */
    public static String badge(double rvs) {
        if (rvs >= 70) return "green";
        if (rvs >= 45) return "amber";
        return "red";
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private static double clamp(double v) {
        return Math.max(0.0, Math.min(100.0, v));
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}

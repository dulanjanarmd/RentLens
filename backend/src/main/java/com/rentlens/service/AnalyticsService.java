package com.rentlens.service;

import com.rentlens.dto.AnalyticsDTO;
import com.rentlens.repository.PropertyRepository;
import com.rentlens.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final PropertyRepository propertyRepository;
    private final ReviewRepository   reviewRepository;

    /**
     * Builds the market dashboard payload (SRS §3.7):
     *  - Average rent by area
     *  - Complaint tag frequencies
     *  - RVS distribution buckets
     */
    @Transactional(readOnly = true)
    public AnalyticsDTO.MarketDashboard getMarketDashboard() {

        // ── Area stats ────────────────────────────────────────────────────────────
        List<Object[]> areaRaw = propertyRepository.getAreaStats();
        List<AnalyticsDTO.AreaStat> areaStats = areaRaw.stream().map(row ->
            AnalyticsDTO.AreaStat.builder()
                .area((String) row[0])
                .avgPrice(((Number) row[1]).doubleValue())
                .propertyCount(((Number) row[2]).intValue())
                .avgRating(row[3] != null ? ((Number) row[3]).doubleValue() : 0.0)
                .build()
        ).collect(Collectors.toList());

        // ── Complaint tag frequencies ─────────────────────────────────────────────
        List<String> allTagsRaw = reviewRepository.findAllComplaintTagsRaw();
        Map<String, Long> tagFreq = new HashMap<>();
        for (String raw : allTagsRaw) {
            if (raw == null || raw.isBlank()) continue;
            for (String tag : raw.split(",")) {
                String t = tag.trim();
                if (!t.isEmpty()) tagFreq.merge(t, 1L, Long::sum);
            }
        }
        List<AnalyticsDTO.ComplaintPattern> complaints = tagFreq.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> AnalyticsDTO.ComplaintPattern.builder()
                        .tag(e.getKey())
                        .count(e.getValue().intValue())
                        .build())
                .collect(Collectors.toList());

        // ── RVS distribution (10-point buckets) ───────────────────────────────────
        List<Integer> rvsValues = propertyRepository.findAll().stream()
                .map(p -> (int) Math.floor(p.getRentValueScore() / 10) * 10)
                .collect(Collectors.toList());
        Map<String, Long> rvsBuckets = new TreeMap<>();
        for (int bucket = 0; bucket <= 90; bucket += 10) {
            final int b = bucket;
            rvsBuckets.put(b + "-" + (b + 9),
                    rvsValues.stream().filter(v -> v == b).count());
        }

        return AnalyticsDTO.MarketDashboard.builder()
                .areaStats(areaStats)
                .complaintPatterns(complaints)
                .rvsBuckets(rvsBuckets)
                .totalProperties(propertyRepository.countAll())
                .build();
    }
}

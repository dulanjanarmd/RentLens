package com.rentlens.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

public class AnalyticsDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarketDashboard {
        private List<AreaStat>        areaStats;
        private List<ComplaintPattern> complaintPatterns;
        private Map<String, Long>      rvsBuckets;
        private long                   totalProperties;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AreaStat {
        private String area;
        private double avgPrice;
        private int    propertyCount;
        private double avgRating;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintPattern {
        private String tag;
        private int    count;
    }
}

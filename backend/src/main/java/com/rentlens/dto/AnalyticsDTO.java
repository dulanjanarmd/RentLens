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
        private List<PriceHistoryStat> priceHistory;
        private List<TypeStat>         typeStats;
        private List<FurnishedStat>    furnishedStats;
        private List<BedroomStat>      bedroomStats;
        private double                 globalAvgRent;
        private String                 topArea;
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PriceHistoryStat {
        private String month;
        private int average;
        private int median;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TypeStat {
        private String propertyType;
        private int count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FurnishedStat {
        private String status; // "Furnished" or "Unfurnished"
        private double avgPrice;
        private int count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BedroomStat {
        private int bedrooms;
        private double avgPrice;
        private int count;
    }
}

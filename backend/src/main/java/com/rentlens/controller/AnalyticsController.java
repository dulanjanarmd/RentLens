package com.rentlens.controller;

import com.rentlens.dto.AnalyticsDTO;
import com.rentlens.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // ── GET /api/analytics/market ────────────────────────────────────────────────
    @GetMapping("/market")
    public ResponseEntity<AnalyticsDTO.MarketDashboard> getMarketDashboard() {
        return ResponseEntity.ok(analyticsService.getMarketDashboard());
    }
}

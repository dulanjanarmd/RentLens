package com.rentlens.controller;

import com.rentlens.dto.ReviewDTO;
import com.rentlens.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ── GET /api/reviews/property/{propertyId} ───────────────────────────────────
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewDTO>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getByProperty(propertyId));
    }

    // ── POST /api/reviews ────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<ReviewDTO> create(@Valid @RequestBody ReviewDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(dto));
    }
}

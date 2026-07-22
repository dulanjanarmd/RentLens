package com.rentlens.controller;

import com.rentlens.dto.PropertyDTO;
import com.rentlens.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // ── GET /api/properties ──────────────────────────────────────────────────────
    /**
     * List all properties with optional query filters.
     *
     * Query params (all optional):
     *   area       : filter by area name (case-insensitive)
     *   minPrice   : minimum rent in LKR
     *   maxPrice   : maximum rent in LKR
     *   bedrooms   : exact number of bedrooms
     *   minRating  : minimum average review rating
     */
    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAll(
            @RequestParam(required = false) String  area,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Double  minRating) {

        return ResponseEntity.ok(
                propertyService.getAll(area, minPrice, maxPrice, bedrooms, minRating));
    }

    // ── GET /api/properties/{id} ─────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    // ── GET /api/properties/recommend?budget=50000 ───────────────────────────────
    @GetMapping("/recommend")
    public ResponseEntity<List<PropertyDTO>> recommend(@RequestParam int budget) {
        return ResponseEntity.ok(propertyService.recommend(budget));
    }

    // ── GET /api/properties/compare?ids=1,2,3 ───────────────────────────────────
    @GetMapping("/compare")
    public ResponseEntity<List<PropertyDTO>> compare(@RequestParam String ids) {
        List<Long> idList = Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
        return ResponseEntity.ok(propertyService.compare(idList));
    }

    // ── POST /api/properties ─────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<PropertyDTO> create(@Valid @RequestBody PropertyDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propertyService.create(dto));
    }

    // ── PUT /api/properties/{id} ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDTO dto) {
        return ResponseEntity.ok(propertyService.update(id, dto));
    }

    // ── DELETE /api/properties/{id} ──────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

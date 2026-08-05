package com.rentlens.controller;

import com.rentlens.dto.InquiryDTO;
import com.rentlens.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public ResponseEntity<List<InquiryDTO>> getAll() {
        return ResponseEntity.ok(inquiryService.getAll());
    }

    @PostMapping
    public ResponseEntity<InquiryDTO> create(@Valid @RequestBody InquiryDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inquiryService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inquiryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

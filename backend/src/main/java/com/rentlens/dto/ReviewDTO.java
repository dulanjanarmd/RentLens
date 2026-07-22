package com.rentlens.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    private Long   id;
    private Long   propertyId;
    private String author;
    private Integer rating;   // 1–5
    private String comment;

    /** Complaint tags: e.g. ["water_issues", "noise"] */
    private List<String> complaintTags;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}

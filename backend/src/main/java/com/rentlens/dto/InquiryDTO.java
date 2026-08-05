package com.rentlens.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryDTO {

    private Long id;

    @NotNull(message = "Property ID is required")
    private Long propertyId;
    
    // Optional field to easily display property info in the admin dashboard
    private String propertyTitle;

    @NotBlank(message = "Sender name is required")
    private String senderName;

    @NotBlank(message = "Sender email is required")
    @Email(message = "Email must be valid")
    private String senderEmail;

    @NotBlank(message = "Message is required")
    private String message;

    private LocalDateTime createdAt;
}

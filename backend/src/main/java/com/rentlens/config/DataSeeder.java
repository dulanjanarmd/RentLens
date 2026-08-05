package com.rentlens.config;

import com.rentlens.model.Property;
import com.rentlens.model.Review;
import com.rentlens.model.PriceHistory;
import com.rentlens.model.User;
import com.rentlens.repository.PropertyRepository;
import com.rentlens.repository.ReviewRepository;
import com.rentlens.repository.PriceHistoryRepository;
import com.rentlens.repository.UserRepository;
import com.rentlens.service.RentScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

/**
 * Seeds the database with the 6 sample properties (matching the frontend mock data)
 * and a set of sample reviews on first startup.
 *
 * Idempotent: skips seeding if at least one property already exists.
 * The RVS formula is applied to every property during seeding so scores are
 * immediately available without a separate recalculation pass.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PropertyRepository propertyRepository;
    private final ReviewRepository   reviewRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final RentScoreService   rentScoreService;
    private final UserRepository     userRepository;

    @Override
    @Transactional
    public void run(String... args) {

        seedAdmin();

        if (priceHistoryRepository.count() == 0) {
            log.info("DataSeeder: seeding price history...");
            seedPriceHistory();
        }

        if (propertyRepository.count() > 0) {
            log.info("DataSeeder: properties already seeded. Skipping.");
            return;
        }

        log.info("DataSeeder: seeding properties and reviews...");
        List<Property> properties = seedProperties();

        // Collect all prices for market-relative RVS calculation
        List<Integer> allPrices = properties.stream().map(Property::getPrice).toList();
        properties.forEach(p -> rentScoreService.computeAndApply(p, allPrices));

        List<Property> saved = propertyRepository.saveAll(properties);
        log.info("DataSeeder: saved {} properties.", saved.size());

        seedReviews(saved);
        log.info("DataSeeder: seeding complete.");
    }

    // ── Price History seed data ──────────────────────────────────────────────────
    private void seedPriceHistory() {
        List<PriceHistory> history = Arrays.asList(
            PriceHistory.builder().month("Jan").averagePrice(42000).medianPrice(40000).sortOrder(1).build(),
            PriceHistory.builder().month("Feb").averagePrice(43000).medianPrice(41000).sortOrder(2).build(),
            PriceHistory.builder().month("Mar").averagePrice(44500).medianPrice(42500).sortOrder(3).build(),
            PriceHistory.builder().month("Apr").averagePrice(45000).medianPrice(44000).sortOrder(4).build(),
            PriceHistory.builder().month("May").averagePrice(46000).medianPrice(45000).sortOrder(5).build(),
            PriceHistory.builder().month("Jun").averagePrice(48000).medianPrice(46500).sortOrder(6).build()
        );
        priceHistoryRepository.saveAll(history);
        log.info("DataSeeder: saved {} price history records.", history.size());
    }

    // ── Property seed data (mirrors frontend/lib/mockData.js) ────────────────────

    private List<Property> seedProperties() {
        return Arrays.asList(

            property(
                "Modern Apartment in Malabe",
                "Malabe", 45000, 2, 1, 850, 2.3,
                List.of("WiFi", "Parking", "AC", "Water Tank"),
                "John Silva", "+94 70 123 4567",
                "Spacious modern apartment with excellent facilities and friendly landlord.",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=550&fit=crop",
                true, 6.9271, 80.7743, LocalDate.of(2026, 1, 15)
            ),

            property(
                "Cozy Room in Kaduwela",
                "Kaduwela", 25000, 1, 1, 450, 3.5,
                List.of("WiFi", "Shared Kitchen", "Garden"),
                "Maria Perera", "+94 70 234 5678",
                "Budget-friendly room perfect for students in a safe area.",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=550&fit=crop",
                true, 6.8924, 80.7725, LocalDate.of(2026, 1, 18)
            ),

            property(
                "Luxury Flat with City View",
                "Colombo 7", 120000, 3, 2, 1500, 0.5,
                List.of("WiFi", "Parking", "AC", "Generator", "Security", "Pool"),
                "Premium Properties Ltd", "+94 70 345 6789",
                "Premium apartment with modern amenities and premium security.",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=550&fit=crop",
                true, 6.9271, 80.6353, LocalDate.of(2026, 1, 10)
            ),

            property(
                "Student Hostel Room",
                "Maharagama", 18000, 1, 1, 300, 5.2,
                List.of("WiFi", "Shared Kitchen", "Laundry"),
                "Youth Accommodations", "+94 70 456 7890",
                "Affordable hostel room suitable for students.",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=550&fit=crop",
                false, 6.8358, 80.7447, LocalDate.of(2026, 1, 20)
            ),

            property(
                "Villa with Garden",
                "Nugegoda", 95000, 4, 2, 2200, 2.8,
                List.of("WiFi", "Parking", "Garden", "AC", "Generator"),
                "Mr. Wijesinghe", "+94 70 567 8901",
                "Beautiful villa with spacious garden and modern facilities.",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=550&fit=crop",
                true, 6.8769, 80.7799, LocalDate.of(2026, 1, 12)
            ),

            property(
                "Studio Apartment",
                "Wellawatte", 35000, 1, 1, 600, 1.2,
                List.of("WiFi", "AC", "Parking"),
                "Colombo Residences", "+94 70 678 9012",
                "Compact studio perfect for professionals.",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=550&fit=crop",
                true, 6.8382, 80.6545, LocalDate.of(2026, 1, 17)
            )
        );
    }

    private Property property(
            String title, String area, int price, int beds, int baths,
            int sqft, double dist, List<String> facilities,
            String landlord, String phone, String desc,
            String img, boolean verified, double lat, double lng, LocalDate postedDate) {

        Property p = Property.builder()
                .title(title).area(area).price(price)
                .bedrooms(beds).bathrooms(baths).squareFeet(sqft).distance(dist)
                .landlord(landlord).phone(phone).description(desc).imageUrl(img)
                .verified(verified).latitude(lat).longitude(lng).postedDate(postedDate)
                .rating(0.0).reviewCount(0).reviewScore(50.0)
                .build();
        p.setFacilitiesList(facilities);
        return p;
    }

    // ── Review seed data ──────────────────────────────────────────────────────────

    private void seedReviews(List<Property> properties) {
        // Seed 3 reviews per property to bootstrap rating aggregates

        for (Property prop : properties) {
            List<Review> reviews = buildReviews(prop);
            reviewRepository.saveAll(reviews);

            // Update rating aggregate on property
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            prop.setRating(Math.round(avg * 10.0) / 10.0);
            prop.setReviewCount(reviews.size());
            List<Integer> allPrices = properties.stream().map(Property::getPrice).toList();
            rentScoreService.computeAndApply(prop, allPrices);
            propertyRepository.save(prop);
        }
    }

    private List<Review> buildReviews(Property prop) {
        switch (prop.getTitle()) {
            case "Modern Apartment in Malabe":
                return List.of(
                    review(prop, "Ahmed Hassan", 4, "Great location and friendly landlord. Had minor water issues but resolved quickly.", "water_issues"),
                    review(prop, "Priya Kumari",  5, "Excellent apartment with all facilities. Highly recommended!", null),
                    review(prop, "John Silva",    3, "Good place but can be noisy during weekends.", "noise")
                );
            case "Cozy Room in Kaduwela":
                return List.of(
                    review(prop, "Saman Fernando",  4, "Nice budget room, landlord is helpful.", null),
                    review(prop, "Nisha Perera",     4, "Clean and affordable, great for students.", null),
                    review(prop, "Ruwan Jayawardena",3, "Maintenance took a while to respond.", "maintenance_delays")
                );
            case "Luxury Flat with City View":
                return List.of(
                    review(prop, "Dilshan Wickrama", 5, "Absolutely stunning views and top-notch security.", null),
                    review(prop, "Amara Silva",       5, "Best apartment in Colombo 7, worth every rupee.", null),
                    review(prop, "Tharaka Karunas",   5, "Premium experience, very professional management.", null)
                );
            case "Student Hostel Room":
                return List.of(
                    review(prop, "Kasun Madushanka", 3, "Affordable but noisy on weekends.", "noise"),
                    review(prop, "Malith Perera",    4, "Good for the price, basic amenities available.", null),
                    review(prop, "Sachini Rathnay",  3, "Overcrowded at times but manageable.", "overcrowding")
                );
            case "Villa with Garden":
                return List.of(
                    review(prop, "Chamath Silva",     5, "Beautiful villa with amazing garden. Highly recommended!", null),
                    review(prop, "Ishani Fernando",   4, "Great space for families, slight maintenance delay once.", "maintenance_delays"),
                    review(prop, "Dilan Rajapaksha",  5, "Best villa I've stayed in. Landlord is very responsive.", null)
                );
            default: // Studio Apartment
                return List.of(
                    review(prop, "Nadeesha Cooray",  4, "Perfect studio for a professional. Very clean.", null),
                    review(prop, "Ravindu Senanayake",4,"Great location, close to everything.", null),
                    review(prop, "Thilini Bandara",  4, "Compact but very well maintained.", null)
                );
        }
    }

    private Review review(Property prop, String author, int rating, String comment, String tag) {
        Review r = Review.builder()
                .property(prop)
                .author(author)
                .rating(rating)
                .comment(comment)
                .createdAt(LocalDateTime.now().minusDays((long)(Math.random() * 60)))
                .build();
        r.setComplaintTagsList(tag != null ? List.of(tag) : List.of());
        return r;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@rentlens.com")) {
            User admin = User.builder()
                    .email("admin@rentlens.com")
                    .name("System Admin")
                    .passwordHash(hashPassword("admin123"))
                    .role("ADMIN")
                    .profileImage("https://api.dicebear.com/7.x/avataaars/svg?seed=admin")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("DataSeeder: seeded default ADMIN user.");
        }
    }
}

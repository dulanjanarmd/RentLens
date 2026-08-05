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
    private final com.rentlens.repository.BlogPostRepository blogPostRepository;

    @Override
    @Transactional
    public void run(String... args) {

        seedAdmin();

        if (priceHistoryRepository.count() == 0) {
            log.info("DataSeeder: seeding price history...");
            seedPriceHistory();
        }

        if (blogPostRepository.count() == 0) {
            log.info("DataSeeder: seeding blogs...");
            seedBlogs();
        }

        if (propertyRepository.count() == 0) {
            log.info("DataSeeder: No properties found. Seeding initial data...");
            log.info("DataSeeder: seeding properties and reviews...");
            List<Property> properties = seedProperties();

            // Collect all prices for market-relative RVS calculation
            List<Integer> allPrices = properties.stream().map(Property::getPrice).toList();
            properties.forEach(p -> rentScoreService.computeAndApply(p, allPrices));

            List<Property> saved = propertyRepository.saveAll(properties);
            log.info("DataSeeder: saved {} properties.", saved.size());

            seedReviews(saved);
            log.info("DataSeeder: seeding complete.");
        } else {
            log.info("DataSeeder: Properties exist. Forcing coordinate updates...");
            forceUpdateCoordinates();
        }

        if (propertyRepository.findByTitleContainingIgnoreCase("Seaside Penthouse").isEmpty()) {
            log.info("DataSeeder: Seeding extra properties for analytics...");
            seedExtraProperties();
        }
    }

    private void forceUpdateCoordinates() {
        updatePropertyCoords("Modern Apartment in Malabe", 6.9061, 79.9696);
        updatePropertyCoords("Cozy Room in Kaduwela", 6.9350, 79.9840);
        updatePropertyCoords("Luxury Flat with City View", 6.9142, 79.8703);
        updatePropertyCoords("Student Hostel Room", 6.8511, 79.9212);
        updatePropertyCoords("Villa with Garden", 6.8741, 79.8973);
        updatePropertyCoords("Studio Apartment", 6.8748, 79.8601);
    }

    private void updatePropertyCoords(String title, double lat, double lng) {
        propertyRepository.findByTitleContainingIgnoreCase(title).stream().findFirst().ifPresent(p -> {
            p.setLatitude(lat);
            p.setLongitude(lng);
            propertyRepository.save(p);
            log.info("Updated coordinates for: " + title);
        });
    }

    private void seedExtraProperties() {
        List<Property> extras = Arrays.asList(
            Property.builder().title("Seaside Penthouse").area("Mount Lavinia").price(250000)
                .bedrooms(3).bathrooms(3).squareFeet(2500).distance(0.5).propertyType("Apartment").furnished(true)
                .landlord("Seaside Estates").phone("0711122334").description("Luxurious penthouse overlooking the beach.")
                .imageUrl("https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=550&fit=crop")
                .verified(true).latitude(6.8290).longitude(79.8631).postedDate(LocalDate.now().minusDays(5)).availableFrom(LocalDate.now().plusDays(10))
                .rating(4.8).reviewCount(12).reviewScore(95.0).rentValueScore(88.5).build(),
            Property.builder().title("Family House with Large Yard").area("Battaramulla").price(85000)
                .bedrooms(4).bathrooms(2).squareFeet(3000).distance(2.5).propertyType("House").furnished(false)
                .landlord("Mr. Perera").phone("0771234567").description("Quiet family home with a huge garden, pet friendly.")
                .imageUrl("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=550&fit=crop")
                .verified(true).latitude(6.8988).longitude(79.9223).postedDate(LocalDate.now().minusDays(15)).availableFrom(LocalDate.now())
                .rating(4.2).reviewCount(4).reviewScore(84.0).rentValueScore(75.2).build(),
            Property.builder().title("Downtown Commercial Office").area("Colombo 3").price(350000)
                .bedrooms(5).bathrooms(4).squareFeet(4000).distance(0.1).propertyType("Commercial").furnished(true)
                .landlord("C3 Properties").phone("0112345678").description("Premium office space in the heart of the city.")
                .imageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=550&fit=crop")
                .verified(true).latitude(6.9113).longitude(79.8504).postedDate(LocalDate.now().minusDays(2)).availableFrom(LocalDate.now().plusDays(30))
                .rating(4.5).reviewCount(8).reviewScore(90.0).rentValueScore(82.0).build(),
            Property.builder().title("Budget Room for Rent").area("Dehiwala").price(18000)
                .bedrooms(1).bathrooms(1).squareFeet(200).distance(1.2).propertyType("Room").furnished(false)
                .landlord("Mrs. Silva").phone("0719876543").description("Basic room for a single person. Shared bathroom.")
                .imageUrl("https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=550&fit=crop")
                .verified(false).latitude(6.8510).longitude(79.8656).postedDate(LocalDate.now().minusDays(20)).availableFrom(LocalDate.now())
                .rating(3.2).reviewCount(2).reviewScore(64.0).rentValueScore(55.0).build(),
            Property.builder().title("Modern Duplex House").area("Nugegoda").price(110000)
                .bedrooms(3).bathrooms(2).squareFeet(1800).distance(1.5).propertyType("House").furnished(true)
                .landlord("John Doe").phone("0701122334").description("Newly built duplex with all modern amenities.")
                .imageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=550&fit=crop")
                .verified(true).latitude(6.8741).longitude(79.8973).postedDate(LocalDate.now().minusDays(8)).availableFrom(LocalDate.now().plusDays(5))
                .rating(4.6).reviewCount(6).reviewScore(92.0).rentValueScore(81.5).build(),
            Property.builder().title("Cozy Studio near Campus").area("Malabe").price(32000)
                .bedrooms(1).bathrooms(1).squareFeet(400).distance(0.8).propertyType("Apartment").furnished(true)
                .landlord("Campus Living").phone("0772233445").description("Perfect for students, 5 mins walk to SLIIT.")
                .imageUrl("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=550&fit=crop")
                .verified(true).latitude(6.9147).longitude(79.9729).postedDate(LocalDate.now().minusDays(3)).availableFrom(LocalDate.now())
                .rating(4.0).reviewCount(15).reviewScore(80.0).rentValueScore(78.0).build(),
            Property.builder().title("Unfurnished 2BR Apartment").area("Kotte").price(55000)
                .bedrooms(2).bathrooms(1).squareFeet(900).distance(2.0).propertyType("Apartment").furnished(false)
                .landlord("Kotte Rentals").phone("0713344556").description("Spacious but needs your own furniture.")
                .imageUrl("https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=550&fit=crop")
                .verified(false).latitude(6.8920).longitude(79.9056).postedDate(LocalDate.now().minusDays(10)).availableFrom(LocalDate.now())
                .rating(3.8).reviewCount(3).reviewScore(76.0).rentValueScore(68.5).build(),
            Property.builder().title("Luxury Villa with Pool").area("Colombo 7").price(450000)
                .bedrooms(5).bathrooms(5).squareFeet(6000).distance(0.5).propertyType("House").furnished(true)
                .landlord("Elite Homes").phone("0779998887").description("Magnificent villa with private pool and garden.")
                .imageUrl("https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=550&fit=crop")
                .verified(true).latitude(6.9125).longitude(79.8650).postedDate(LocalDate.now().minusDays(1)).availableFrom(LocalDate.now().plusDays(15))
                .rating(4.9).reviewCount(20).reviewScore(98.0).rentValueScore(92.0).build()
        );
        
        extras.forEach(p -> {
            p.setFacilitiesList(List.of("WiFi", "AC"));
        });
        propertyRepository.saveAll(extras);
        log.info("DataSeeder: Seeded {} extra properties for analytics.", extras.size());
    }

    private void seedBlogs() {
        List<com.rentlens.model.BlogPost> blogs = Arrays.asList(
            com.rentlens.model.BlogPost.builder()
                .title("5 Tips for Finding the Perfect Apartment in Colombo")
                .content("Colombo is a bustling city with a rapidly changing real estate market. Finding the perfect apartment can be challenging, but with these 5 tips, you will be well on your way...\\n\\n1. Know your budget and stick to it.\\n2. Choose a location near your workplace to avoid traffic.\\n3. Check for essential amenities.\\n4. Inspect the property thoroughly.\\n5. Read the lease agreement carefully.")
                .excerpt("Colombo is a bustling city with a rapidly changing real estate market. Finding the perfect apartment can be challenging...")
                .author("RentLens Team")
                .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                .build(),
            com.rentlens.model.BlogPost.builder()
                .title("Understanding Rent Scores: How We Rate Properties")
                .content("At RentLens, we believe in transparency. That's why we introduced the Rent Value Score (RVS). Our algorithm takes into account the property's price, location, amenities, and user reviews to give you a single, easy-to-understand score out of 100.")
                .excerpt("At RentLens, we believe in transparency. That's why we introduced the Rent Value Score (RVS).")
                .author("Tech Team")
                .imageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                .build()
        );
        blogPostRepository.saveAll(blogs);
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
                true, 6.9061, 79.9696, LocalDate.of(2026, 1, 15)
            ),

            property(
                "Cozy Room in Kaduwela",
                "Kaduwela", 25000, 1, 1, 450, 3.5,
                List.of("WiFi", "Shared Kitchen", "Garden"),
                "Maria Perera", "+94 70 234 5678",
                "Budget-friendly room perfect for students in a safe area.",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=550&fit=crop",
                true, 6.9350, 79.9840, LocalDate.of(2026, 1, 18)
            ),

            property(
                "Luxury Flat with City View",
                "Colombo 7", 120000, 3, 2, 1500, 0.5,
                List.of("WiFi", "Parking", "AC", "Generator", "Security", "Pool"),
                "Premium Properties Ltd", "+94 70 345 6789",
                "Premium apartment with modern amenities and premium security.",
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=550&fit=crop",
                true, 6.9142, 79.8703, LocalDate.of(2026, 1, 10)
            ),

            property(
                "Student Hostel Room",
                "Maharagama", 18000, 1, 1, 300, 5.2,
                List.of("WiFi", "Shared Kitchen", "Laundry"),
                "Youth Accommodations", "+94 70 456 7890",
                "Affordable hostel room suitable for students.",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=550&fit=crop",
                false, 6.8511, 79.9212, LocalDate.of(2026, 1, 20)
            ),

            property(
                "Villa with Garden",
                "Nugegoda", 95000, 4, 2, 2200, 2.8,
                List.of("WiFi", "Parking", "Garden", "AC", "Generator"),
                "Mr. Wijesinghe", "+94 70 567 8901",
                "Beautiful villa with spacious garden and modern facilities.",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=550&fit=crop",
                true, 6.8741, 79.8973, LocalDate.of(2026, 1, 12)
            ),

            property(
                "Studio Apartment",
                "Wellawatte", 35000, 1, 1, 600, 1.2,
                List.of("WiFi", "AC", "Parking"),
                "Colombo Residences", "+94 70 678 9012",
                "Compact studio perfect for professionals.",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=550&fit=crop",
                true, 6.8748, 79.8601, LocalDate.of(2026, 1, 17)
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

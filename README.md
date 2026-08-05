# 🏢 RentLens - Advanced Property Rental Platform

RentLens is a next-generation real estate and property rental platform designed to bring transparency, data analytics, and a seamless user experience to the housing market. It bridges the gap between landlords and tenants through an intelligent scoring algorithm, interactive maps, and rich data visualization.

---

## 🌟 Key Features

### 1. Rent Value Score (RVS) Engine
At the core of RentLens is the **Rent Value Score (RVS)**. Instead of relying purely on subjective opinions, our proprietary algorithm automatically evaluates every property and scores it out of 100 based on:
- **Market Price Positioning:** Compares the rent to the current global market average.
- **Location Proximity:** Calculates distance to major transport hubs and universities.
- **Facility Richness:** Evaluates included amenities (WiFi, AC, Parking, etc.).
- **Community Rating:** Incorporates verified tenant reviews.

### 2. Advanced Analytics Dashboard
A powerful data center built for real estate monitoring:
- **RVS Distribution (Area Chart):** Visualizes the quality of properties across the market.
- **Rent by Bedrooms (Bar Chart):** Real-time aggregation of average prices based on property size.
- **Property Typology (Donut Chart):** Breakdown of Houses, Apartments, Rooms, and Commercial spaces.
- **Top Ranked Properties:** Real-time data table displaying the highest-scoring properties on the platform.

### 3. Airbnb-Style Map Search
- Split-screen interactive map powered by **React-Leaflet** and **OpenStreetMap**.
- Users can visually explore properties across different cities and neighborhoods.
- Live filtering syncs instantly with the map markers.

### 4. Smart Budget Advisor
- Users input their maximum monthly budget.
- The system automatically retrieves and ranks the best possible properties under that budget using the RVS engine, ensuring users get the best value for their money.

### 5. Rich Property Listings
- Extensive property details including virtual tours, multi-image masonry galleries, verified badges, and dynamic map pins.
- Landlords can easily list properties with our intuitive, multi-section property submission form, complete with drag-and-drop image uploads.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS for a modern, responsive, glassmorphic UI.
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Maps:** React-Leaflet & Leaflet.js
- **Routing:** React Router DOM

### Backend (API & Core Logic)
- **Framework:** Spring Boot 3 (Java 17)
- **Data Access:** Spring Data JPA / Hibernate
- **Database:** MySQL
- **Validation:** Jakarta Bean Validation
- **Build Tool:** Maven

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- MySQL Server (v8+)
- Maven

### 1. Database Setup
Create a new MySQL database for the application:
```sql
CREATE DATABASE rentlens_db;
```
Ensure your `application.properties` (in `backend/src/main/resources`) matches your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Running the Backend (Spring Boot)
Open a terminal in the `backend` directory and run:
```bash
cd backend
mvn spring-boot:run
```
*Note: The backend runs on `http://localhost:8080`. On the first startup, the `DataSeeder` will automatically inject sample properties, users, and reviews into your database.*

### 3. Running the Frontend (React + Vite)
Open a terminal in the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:3000`.*

---

## 📁 Project Structure

```
RentLens/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/.../
│   │   ├── config/           # CORS, Exception Handling, Data Seeder
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # JPA Entities (Property, Review, etc.)
│   │   ├── repository/       # Spring Data Repositories
│   │   └── service/          # Business Logic & RVS Algorithm
│   └── pom.xml               # Maven Dependencies
│
└── frontend/                 # React Application
    ├── src/
    │   ├── components/       # Reusable UI components (Navbar, Cards)
    │   ├── pages/            # Application routes (Dashboard, MapSearch, AddProperty)
    │   ├── lib/              # API clients and utilities
    │   └── index.css         # Tailwind global styles
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite configuration
```

---

## 🔐 Security & CORS
- The backend is configured to accept Cross-Origin Resource Sharing (CORS) from `http://localhost:3000` via the `CorsConfig` class.
- File uploads are securely stored locally, and paths are sanitized to prevent directory traversal attacks.

---

## 🎨 Design Philosophy
RentLens prioritizes **Visual Excellence**. The UI moves away from generic, flat designs by incorporating:
- Soft shadows and glassmorphism.
- Highly readable, modern typography.
- Color-coded badges (Green/Amber/Red) for instantaneous cognitive recognition of property scores.
- Fluid micro-animations on hover states for an app-like feel.

---
*Built with ❤️ for the future of real estate.*

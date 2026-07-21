# RentLens

**Smart Data-Driven Rental Decisions for Sri Lanka**

RentLens is a modern web platform that helps tenants and property seekers make informed rental decisions in the Sri Lankan housing market. With comprehensive property analytics, user reviews, market insights, and AI-powered assistance, RentLens transforms the rental search experience.

## Overview

RentLens provides intelligent tools and data-driven insights to help you find the perfect rental property. Whether you're searching for your first apartment or comparing multiple options, RentLens simplifies the decision-making process.

## Key Features

### Core Functionality
- **Property Listings**: Browse 2,450+ verified rental properties
- **Smart Search**: Search by area, price range, bedrooms, and amenities
- **Map-Based Search**: Explore properties geographically across Sri Lanka
- **Property Comparison**: Compare up to 4 properties side-by-side
- **Detailed Property Profiles**: Comprehensive information with photos and virtual tours

### Advanced Analytics
- **Rental Value Score (RVS)**: Objective 0-100 rating based on price, location, facilities, and reviews
- **Market Dashboard**: Real-time trends, pricing benchmarks, complaint patterns by area
- **Budget Advisor**: Smart recommendations based on your budget and preferences
- **Risk Analyzer**: 6-factor property risk assessment with mitigation tips

### Community Insights
- **Tenant Reviews**: Authentic feedback from current and former residents
- **Complaint Tracking**: Community-reported issues (water, power, noise, maintenance)
- **Landlord Ratings**: Reliability and responsiveness scores
- **Area Intelligence**: Neighborhood characteristics and convenience ratings

### User Tools
- **User Profiles**: Create account, manage preferences, and save searches
- **Favorites**: Bookmark properties for later comparison
- **Virtual Tours**: 360-degree property exploration and room-by-room navigation
- **Image Gallery**: High-quality property photos with fullscreen viewer
- **AI Chat Assistant**: Instant answers to rental questions

### Design & Experience
- **Light & Dark Mode**: Comfortable viewing in any lighting condition
- **Mobile Responsive**: Seamless experience across all devices
- **Keyboard Navigation**: Full accessibility support
- **Smooth Animations**: Modern, polished interactions

## Getting Started

### For Users
1. Visit the home page to explore properties
2. Use the search bar or browse listings
3. Click any property to view details, photos, and reviews
4. Compare multiple properties side-by-side
5. Create an account to save favorites
6. Ask the AI assistant for help anytime

### For Developers

#### Prerequisites
- Node.js 18+
- pnpm package manager

#### Installation
```bash
# Clone the repository
cd /vercel/share/v0-project

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

#### Project Structure
```
/vercel/share/v0-project/
├── app/
│   ├── page.jsx           # Main app router
│   ├── layout.jsx         # Root layout with theme provider
│   └── globals.css        # Global styles and theme variables
├── components/
│   ├── Navigation.jsx     # Header with theme toggle
│   ├── ThemeToggle.jsx    # Light/dark mode switcher
│   ├── ChatAssistant.jsx  # AI chat widget
│   ├── PropertyCard.jsx   # Property listing card
│   ├── PropertyGallery.jsx
│   ├── VirtualTour.jsx
│   ├── RiskAnalyzer.jsx
│   ├── ReviewCard.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Listings.jsx
│       ├── PropertyDetail.jsx
│       ├── Comparison.jsx
│       ├── Dashboard.jsx
│       ├── BudgetAdvisor.jsx
│       ├── MapSearch.jsx
│       ├── Login.jsx
│       ├── Signup.jsx
│       └── Profile.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useTheme.js
├── lib/
│   └── mockData.js        # Sample property data
└── public/                # Static assets
```

#### Tech Stack
- **Frontend**: React 19 with Next.js 16
- **Styling**: Tailwind CSS v4 with custom design tokens
- **State Management**: React Context + Hooks
- **Visualization**: Recharts for analytics
- **Icons**: Lucide React
- **Maps**: Leaflet (if enabled)
- **Language**: JavaScript (no TypeScript)

## Usage Examples

### Accessing Different Sections
- **Home**: Click RentLens logo or "Home" link
- **Listings**: Browse all properties with filters
- **Map Search**: Find properties by geographic location
- **Comparison**: Add and compare up to 4 properties
- **Dashboard**: View market trends and analytics
- **Budget Advisor**: Get personalized recommendations

### Theme Switching
- Click the Sun/Moon icon in top-right (desktop) or mobile menu
- Theme preference is automatically saved

### User Features
- Create account via "Sign Up" button
- Log in with email/password
- View and manage profile
- Save favorite properties
- Track saved searches

### Property Details
- View comprehensive property information
- See tenant reviews and complaints
- Check rental value score and risk factors
- View property photos and virtual tour
- Contact landlord information

## Data & Mockups

The platform uses realistic mock data for:
- 50+ sample properties across Sri Lanka
- Tenant reviews and ratings
- Market analytics and trends
- Community complaint patterns

Future versions will integrate with:
- Real estate databases
- MLS systems
- Tenant review platforms
- Property management APIs

## Features Documentation

See individual documentation files:
- `FEATURES.md` - Complete feature list
- `THEME_GUIDE.md` - Theme system documentation
- `THEME_IMPLEMENTATION.md` - Technical theme details
- `QUICK_START_THEME.md` - Theme usage guide

## Browser Support

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+
- All modern mobile browsers

## Performance

- Bundle Size: ~150KB (gzipped)
- First Contentful Paint: <1.5s
- Theme Toggle: <100ms
- Mobile Responsive: Optimized for all screen sizes

## Accessibility

- WCAG AAA contrast compliance
- Keyboard navigation support
- ARIA labels and roles
- Screen reader compatible
- Respects system preferences

## Future Enhancements

- Real property data integration
- Advanced filtering and search
- Saved search alerts
- Landlord verification
- Tenant history verification
- Payment integration
- Property management tools
- Mobile native apps

## Support

For issues, questions, or suggestions:
1. Check the documentation files
2. Review the chat assistant for help
3. Refer to the feature guides

## License

This project is part of the Smart Rental Decision Platform research initiative for the Sri Lankan housing market.

---

**RentLens** - Making Rental Decisions Clear

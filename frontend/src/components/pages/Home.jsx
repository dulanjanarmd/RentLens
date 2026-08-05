import { Search, TrendingUp, MapPin, Star, Zap, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

import { useAppNavigation } from '@/hooks/useAppNavigation';

export default function Home() {
  const onNavigate = useAppNavigation();
  const stats = [
    { label: 'Properties Listed', value: '2,450', icon: MapPin },
    { label: 'Reviews Posted', value: '8,920', icon: Star },
    { label: 'Areas Covered', value: '45+', icon: TrendingUp },
  ]

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Rental Decisions Made Clear
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Make data-driven rental decisions in the Sri Lankan housing market. Get objective insights on pricing, location convenience, and landlord reputation.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by area or property name..."
                className="input-field pl-12"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onNavigate('listings')
                  }
                }}
              />
            </div>
            <button
              onClick={() => onNavigate('listings')}
              className="btn-primary whitespace-nowrap"
            >
              Search Properties
            </button>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  key={stat.label} 
                  className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            RentLens Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Rental Value Score
              </h3>
              <p className="text-muted-foreground">
                Get objective 0-100 scores based on price, location, facilities, and community reviews.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Smart Comparison
              </h3>
              <p className="text-muted-foreground">
                Compare multiple properties side-by-side with detailed analytics and insights.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Market Analytics
              </h3>
              <p className="text-muted-foreground">
                View market trends, complaint patterns, and pricing benchmarks by area.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Community Reviews
              </h3>
              <p className="text-muted-foreground">
                Read authentic tenant reviews with tagged complaint patterns for transparency.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Budget Tool
              </h3>
              <p className="text-muted-foreground">
                Get personalized property recommendations based on your budget and preferences.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="card-hover bg-card p-6 rounded-lg border border-border shadow-sm"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Map Visualization
              </h3>
              <p className="text-muted-foreground">
                Explore properties on interactive maps and discover ideal locations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse listings, compare properties, and make confident rental decisions with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('listings')}
              className="btn-primary"
            >
              Browse All Listings
            </button>
            <button
              onClick={() => onNavigate('budget-advisor')}
              className="btn-secondary"
            >
              Find by Budget
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2026 Smart Rental Platform. Making rental decisions smarter, one property at a time.</p>
        </div>
      </footer>
    </main>
  )
}

import { useState, useEffect } from 'react'
import { Search, TrendingUp, MapPin, Star, Zap, BarChart3, Building2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import api from '@/lib/api'

export default function Home() {
  const onNavigate = useAppNavigation()
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProperties()
        setFeaturedProperties(data.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch featured properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <main className="bg-background min-h-screen">
      {/* 1. Immersive Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Luxury modern apartment" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 backdrop-blur-md mb-6 text-sm font-medium">
            Welcome to the Future of Renting
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Find Your <span className="text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Perfect</span> Home
          </h1>
          <p className="text-lg md:text-xl text-white font-medium mb-10 max-w-2xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Data-driven insights, verified reviews, and transparent pricing. The smartest way to rent in Sri Lanka.
          </p>

          {/* Glassmorphic Search Bar */}
          <div className="bg-background/90 dark:bg-card/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-border/50 shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by area, city, or property name..."
                className="w-full h-14 pl-12 pr-4 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') onNavigate('listings')
                }}
              />
            </div>
            <button
              onClick={() => onNavigate('listings')}
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Search Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Featured Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trending Properties</h2>
            <p className="text-muted-foreground">Discover the most highly-rated rentals available right now.</p>
          </div>
          <button 
            onClick={() => onNavigate('listings')}
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => onNavigate('listings')}
              >
                <div className="relative h-60 overflow-hidden bg-muted">
                  <img 
                    src={prop.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm text-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    {prop.score || 85} Score
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 truncate">{prop.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-2xl font-bold text-primary">
                      Rs. {prop.price?.toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal">/mo</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Apple-Style Bento Grid Features */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to rent smart</h2>
            <p className="text-lg text-muted-foreground">Powerful tools designed to give you the upper hand in the rental market.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
            {/* Bento 1: Large feature */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border border-primary/20 relative overflow-hidden group cursor-pointer"
              onClick={() => onNavigate('dashboard')}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Market Analytics</h3>
                  <p className="text-muted-foreground max-w-sm">Deep dive into local pricing trends and area statistics to ensure you never overpay for rent again.</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform translate-x-1/4 translate-y-1/4">
                <TrendingUp className="w-64 h-64 text-primary" />
              </div>
            </motion.div>

            {/* Bento 2: Medium feature */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 bg-card rounded-3xl p-8 border border-border flex items-center gap-6 cursor-pointer"
              onClick={() => onNavigate('budget-advisor')}
            >
              <div className="w-16 h-16 bg-accent/20 shrink-0 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Budget Advisor</h3>
                <p className="text-muted-foreground">Input your income, and let our AI suggest optimal areas and properties.</p>
              </div>
            </motion.div>

            {/* Bento 3: Small feature */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-card rounded-3xl p-6 border border-border flex flex-col justify-between cursor-pointer"
              onClick={() => onNavigate('comparison')}
            >
              <Building2 className="w-8 h-8 text-foreground" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Compare</h3>
                <p className="text-sm text-muted-foreground">Side-by-side specs</p>
              </div>
            </motion.div>

            {/* Bento 4: Small feature */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="bg-card rounded-3xl p-6 border border-border flex flex-col justify-between cursor-pointer"
              onClick={() => onNavigate('map-search')}
            >
              <MapPin className="w-8 h-8 text-foreground" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Map View</h3>
                <p className="text-sm text-muted-foreground">Location scoring</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Professional Mega-Footer */}
      <footer className="bg-background border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                RentLens
              </h3>
              <p className="text-muted-foreground mb-6">
                Bringing transparency, data, and trust to the Sri Lankan rental market.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><button onClick={() => onNavigate('listings')} className="hover:text-primary transition-colors">Property Search</button></li>
                <li><button onClick={() => onNavigate('comparison')} className="hover:text-primary transition-colors">Comparison Tool</button></li>
                <li><button onClick={() => onNavigate('budget-advisor')} className="hover:text-primary transition-colors">Budget Advisor</button></li>
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-primary transition-colors">Market Analytics</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 RentLens. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

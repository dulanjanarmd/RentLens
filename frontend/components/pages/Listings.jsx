import { useState, useMemo } from 'react'
import { Search, Filter, Star, MapPin, DollarSign, Home } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import PropertyCard from '@/components/PropertyCard'

export default function Listings({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [selectedArea, setSelectedArea] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [bedrooms, setBedrooms] = useState('')

  const areas = [...new Set(mockProperties.map((p) => p.area))]

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice =
        property.price >= priceRange[0] && property.price <= priceRange[1]
      const matchesArea = !selectedArea || property.area === selectedArea
      const matchesRating = property.rating >= minRating
      const matchesBedrooms = !bedrooms || property.bedrooms === parseInt(bedrooms)

      return (
        matchesSearch &&
        matchesPrice &&
        matchesArea &&
        matchesRating &&
        matchesBedrooms
      )
    })
  }, [searchQuery, priceRange, selectedArea, minRating, bedrooms])

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse Properties
          </h1>
          <p className="text-muted-foreground">
            {filteredProperties.length} properties found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border space-y-6 sticky top-24">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Price Range (LKR)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{priceRange[0].toLocaleString()}</span>
                    <span>{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="input-field"
                >
                  <option value="0">All Ratings</option>
                  <option value="3">3+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setPriceRange([0, 150000])
                  setSelectedArea('')
                  setMinRating(0)
                  setBedrooms('')
                }}
                className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => onNavigate('property', property.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-lg border border-border text-center">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No properties found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

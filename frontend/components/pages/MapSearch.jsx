import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, DollarSign, Sliders } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'

export default function MapSearch({ onNavigate }) {
  const [properties, setProperties] = useState(mockProperties)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 200000,
    minBedrooms: 1,
    maxBedrooms: 5,
  })

  const areas = [
    { name: 'Colombo', lat: 6.9271, lng: 80.7789, count: 15 },
    { name: 'Kandy', lat: 7.2906, lng: 80.6337, count: 8 },
    { name: 'Galle', lat: 6.0535, lng: 80.2211, count: 12 },
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255, count: 5 },
    { name: 'Negombo', lat: 7.2064, lng: 79.8395, count: 10 },
  ]

  const filteredProperties = mockProperties.filter(
    (p) =>
      p.price >= filters.minPrice &&
      p.price <= filters.maxPrice &&
      p.bedrooms >= filters.minBedrooms &&
      p.bedrooms <= filters.maxBedrooms
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header with controls */}
      <div className="bg-card border-b border-border p-6 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by area or property name..."
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: parseInt(e.target.value) })
                    }
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                    }
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Min Bedrooms
                  </label>
                  <select
                    value={filters.minBedrooms}
                    onChange={(e) =>
                      setFilters({ ...filters, minBedrooms: parseInt(e.target.value) })
                    }
                    className="input-field w-full"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}+
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Bedrooms
                  </label>
                  <select
                    value={filters.maxBedrooms}
                    onChange={(e) =>
                      setFilters({ ...filters, maxBedrooms: parseInt(e.target.value) })
                    }
                    className="input-field w-full"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Simplified Map */}
            <div className="relative w-full h-96 md:h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 p-6">
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Interactive Map View
                </h3>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredProperties.length} properties in Sri Lanka
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
                  {areas.map((area) => (
                    <div
                      key={area.name}
                      className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-foreground text-sm">{area.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {area.count} properties
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Markers */}
              {filteredProperties.slice(0, 5).map((property, idx) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`absolute p-2 rounded-full transition-all ${
                    selectedProperty?.id === property.id
                      ? 'bg-primary text-white scale-110'
                      : 'bg-white dark:bg-slate-700 text-primary hover:scale-110'
                  }`}
                  style={{
                    left: `${20 + idx * 15}%`,
                    top: `${30 + idx * 10}%`,
                  }}
                  title={property.title}
                >
                  <MapPin className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Selected Property Info */}
          {selectedProperty ? (
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold text-foreground mb-2">
                {selectedProperty.title}
              </h3>
              <div className="space-y-2 mb-4 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {selectedProperty.area}
                </p>
                <p className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <DollarSign className="w-5 h-5" />
                  LKR {selectedProperty.price.toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  {selectedProperty.bedrooms} BR • {selectedProperty.bathrooms} BA
                </p>
              </div>
              <button
                onClick={() => onNavigate('property', selectedProperty.id)}
                className="btn-primary w-full justify-center"
              >
                View Details
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Click on a property marker to see details
              </p>
            </div>
          )}

          {/* Properties List */}
          <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
            <h4 className="font-semibold text-foreground mb-3">
              Properties ({filteredProperties.length})
            </h4>
            {filteredProperties.slice(0, 8).map((property) => (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedProperty?.id === property.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-secondary/50 border-border hover:border-primary'
                }`}
              >
                <p className="font-medium text-foreground text-sm line-clamp-1">
                  {property.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  LKR {property.price.toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

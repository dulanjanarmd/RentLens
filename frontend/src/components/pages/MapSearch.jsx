import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search, MapPin, Sliders, ChevronDown } from 'lucide-react'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import PropertyCard from '@/components/PropertyCard'
import { getProperties } from '@/lib/api'

// Function to generate dynamic price tag markers
const createPriceTagIcon = (price, isHovered) => {
  const shortPrice = price >= 1000 ? `${(price / 1000).toFixed(0)}k` : price
  
  return new L.DivIcon({
    className: 'custom-price-tag',
    html: `
      <div style="
        background-color: ${isHovered ? '#0f172a' : 'white'};
        color: ${isHovered ? 'white' : '#0f172a'};
        padding: 4px 10px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 13px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        white-space: nowrap;
        transition: all 0.2s ease-in-out;
        transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
        z-index: ${isHovered ? 1000 : 1};
      ">
        LKR ${shortPrice}
      </div>
    `,
    iconSize: [60, 28],
    iconAnchor: [30, 14],
    popupAnchor: [0, -14]
  })
}

// Custom hook to automatically center map when a property is clicked in the list
function MapCenterController({ centerCoordinates }) {
  const map = useMap()
  useEffect(() => {
    if (centerCoordinates) {
      map.flyTo(centerCoordinates, 14, { animate: true, duration: 1 })
    }
  }, [centerCoordinates, map])
  return null
}

export default function MapSearch() {
  const onNavigate = useAppNavigation()
  const [properties, setProperties] = useState([])
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null)
  const [selectedPropertyCenter, setSelectedPropertyCenter] = useState(null)
  
  // Advanced filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Refs for scrolling the list when a map marker is clicked
  const listRefs = useRef({})

  useEffect(() => {
    getProperties()
      .then(data => setProperties(data))
      .catch(err => console.error("Error fetching properties:", err))
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.area.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
      const matchesBedrooms = !bedrooms || p.bedrooms >= parseInt(bedrooms)
      const matchesBathrooms = !bathrooms || p.bathrooms >= parseInt(bathrooms)
      const matchesVerified = !verifiedOnly || p.verified === true
      
      return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms && matchesVerified
    })
  }, [properties, searchQuery, priceRange, bedrooms, bathrooms, verifiedOnly])

  const handleMarkerClick = (property) => {
    // Scroll the sidebar to this property
    if (listRefs.current[property.id]) {
      listRefs.current[property.id].scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHoveredPropertyId(property.id)
      
      // Remove hover state after a few seconds so it doesn't stay stuck
      setTimeout(() => setHoveredPropertyId(null), 3000)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col pt-24 overflow-hidden bg-background">
      
      {/* Horizontal Filter Bar */}
      <div className="bg-background border-b border-border px-6 py-3 flex flex-wrap items-center gap-4 shrink-0 shadow-sm z-20">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Max Price:</span>
          <span className="text-sm text-primary font-bold w-16">{(priceRange[1] / 1000).toFixed(0)}k</span>
          <input
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-32"
          />
        </div>

        <select 
          value={bedrooms} 
          onChange={(e) => setBedrooms(e.target.value)} 
          className="px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm focus:outline-none"
        >
          <option value="">Any Beds</option>
          <option value="1">1+ Beds</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
        </select>

        <select 
          value={bathrooms} 
          onChange={(e) => setBathrooms(e.target.value)} 
          className="px-4 py-2 bg-secondary/50 border border-border rounded-full text-sm focus:outline-none"
        >
          <option value="">Any Baths</option>
          <option value="1">1+ Baths</option>
          <option value="2">2+ Baths</option>
        </select>

        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
          <input
            type="checkbox"
            id="verifiedOnly"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
          />
          <label htmlFor="verifiedOnly" className="text-sm font-medium text-foreground cursor-pointer">
            Verified Only
          </label>
        </div>
        
        <div className="ml-auto text-sm text-muted-foreground font-medium">
          {filteredProperties.length} homes
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden w-full relative z-0">
        
        {/* Left Side: Scrollable List */}
        <div className="w-full md:w-[450px] lg:w-[550px] bg-background border-r border-border overflow-y-auto p-4 md:p-6 space-y-6 z-10 hidden md:block">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No properties found matching your filters.
            </div>
          ) : (
            filteredProperties.map(property => (
              <div 
                key={property.id}
                ref={(el) => (listRefs.current[property.id] = el)}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                className="transition-transform hover:-translate-y-1"
                onClick={() => {
                  if (property.latitude && property.longitude) {
                    setSelectedPropertyCenter([property.latitude, property.longitude])
                  }
                }}
              >
                <PropertyCard 
                  property={property} 
                  onClick={() => {
                    if (property.latitude && property.longitude) {
                      setSelectedPropertyCenter([property.latitude, property.longitude])
                    }
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Right Side: Map */}
        <div className="flex-1 relative z-0 bg-secondary/20">
          <div className="absolute inset-0">
            <MapContainer 
              center={[6.9271, 79.8612]} 
              zoom={12} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenterController centerCoordinates={selectedPropertyCenter} />
            
            {filteredProperties.map(property => {
              if (!property.latitude || !property.longitude) return null
              const isHovered = hoveredPropertyId === property.id
              
              return (
                <Marker 
                  key={property.id} 
                  position={[property.latitude, property.longitude]}
                  icon={createPriceTagIcon(property.price, isHovered)}
                  eventHandlers={{
                    click: () => handleMarkerClick(property),
                    mouseover: () => setHoveredPropertyId(property.id),
                    mouseout: () => setHoveredPropertyId(null),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="w-48 overflow-hidden rounded-lg cursor-pointer" onClick={() => onNavigate('property', property.id)}>
                      <img src={property.imageUrl} alt={property.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{property.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          {property.area}
                        </div>
                        <p className="text-primary font-bold text-sm">LKR {property.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{property.bedrooms} Beds • {property.bathrooms} Baths</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

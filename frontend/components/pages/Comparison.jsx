import { useState, useEffect } from 'react'
import { X, Plus, Star, MapPin, Check, AlertCircle, Loader2 } from 'lucide-react'
import { getProperties, compareProperties } from '@/lib/api'

const RVS_BADGE = {
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red:   'bg-red-100 text-red-800',
}

export default function Comparison({ onNavigate }) {
  const [allProperties, setAllProperties]       = useState([])
  const [selectedIds, setSelectedIds]           = useState([])
  const [comparedProperties, setComparedProperties] = useState([])
  const [showAddProperty, setShowAddProperty]   = useState(false)
  const [loadingAll, setLoadingAll]             = useState(true)
  const [loadingCompare, setLoadingCompare]     = useState(false)

  // Load all properties for the picker
  useEffect(() => {
    getProperties()
      .then(setAllProperties)
      .catch(console.error)
      .finally(() => setLoadingAll(false))
  }, [])

  // Whenever selectedIds changes, fetch detailed comparison data
  useEffect(() => {
    if (selectedIds.length === 0) {
      setComparedProperties([])
      return
    }
    setLoadingCompare(true)
    compareProperties(selectedIds)
      .then(setComparedProperties)
      .catch(console.error)
      .finally(() => setLoadingCompare(false))
  }, [selectedIds])

  const handleAddProperty = (property) => {
    if (!selectedIds.includes(property.id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, property.id])
      setShowAddProperty(false)
    }
  }

  const handleRemoveProperty = (propertyId) => {
    setSelectedIds(selectedIds.filter((id) => id !== propertyId))
  }

  const availableToAdd = allProperties.filter((p) => !selectedIds.includes(p.id))

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Property Comparison</h1>
          <p className="text-muted-foreground">
            Compare up to 4 properties side by side to make the best decision
          </p>
        </div>

        {/* Add Property Button */}
        {selectedIds.length < 4 && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddProperty(!showAddProperty)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Property to Compare
            </button>
          </div>
        )}

        {/* Property Picker */}
        {showAddProperty && (
          <div className="mb-8 bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Select Property</h2>
              <button
                onClick={() => setShowAddProperty(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingAll ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading properties...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableToAdd.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => handleAddProperty(property)}
                    className="text-left p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.area}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      LKR {property.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      RVS: <span className="font-semibold">{property.rentValueScore?.toFixed(1)}</span>
                    </p>
                  </button>
                ))}
                {availableToAdd.length === 0 && (
                  <p className="text-muted-foreground text-sm col-span-3">
                    All properties are already selected.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loadingCompare && (
          <div className="flex items-center gap-2 justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            Loading comparison data...
          </div>
        )}

        {/* Comparison Table */}
        {!loadingCompare && comparedProperties.length > 0 ? (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Property Cards */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold text-foreground w-32 bg-secondary">Property</td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="p-4 min-w-64">
                        <div className="flex justify-between items-start mb-3">
                          <div
                            onClick={() => onNavigate('property', property.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <h3 className="font-semibold text-foreground hover:text-primary line-clamp-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {property.area}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveProperty(property.id)}
                            className="ml-2 p-1 hover:bg-destructive/10 rounded text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Price/Month</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <p className="text-xl font-bold text-primary">
                          LKR {p.price?.toLocaleString()}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* RVS */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Value Score</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className={`inline-block px-3 py-1 rounded-lg font-bold ${RVS_BADGE[p.badge] || RVS_BADGE.amber}`}>
                          {p.rentValueScore?.toFixed(1)}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Bedrooms */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Bedrooms</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-foreground">{p.bedrooms}</td>
                    ))}
                  </tr>

                  {/* Bathrooms */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Bathrooms</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-foreground">{p.bathrooms}</td>
                    ))}
                  </tr>

                  {/* Square Feet */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Square Feet</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-foreground">{p.squareFeet}</td>
                    ))}
                  </tr>

                  {/* Distance */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Distance (km)</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 text-foreground">{p.distance}</td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Rating</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{p.rating?.toFixed(1) ?? '—'}</span>
                          <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Facilities */}
                  <tr className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Facilities</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(p.facilities || []).map((facility) => (
                            <span key={facility} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Verified */}
                  <tr className="hover:bg-secondary/50">
                    <td className="p-4 font-semibold text-foreground bg-secondary">Status</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        {p.verified ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="w-5 h-5" />
                            <span className="text-sm">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">Unverified</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : !loadingCompare && selectedIds.length === 0 ? (
          <div className="bg-card p-12 rounded-lg border border-border text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No properties selected</h3>
            <p className="text-muted-foreground mb-6">
              Add properties to compare their features, prices, and ratings
            </p>
            <button onClick={() => onNavigate('listings')} className="btn-primary">
              Browse Properties
            </button>
          </div>
        ) : null}
      </div>
    </main>
  )
}

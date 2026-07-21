import { useState } from 'react'
import { X, Plus, Star, MapPin, Check, AlertCircle } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import PropertyCard from '@/components/PropertyCard'

export default function Comparison({ onNavigate }) {
  const [selectedProperties, setSelectedProperties] = useState([])
  const [showAddProperty, setShowAddProperty] = useState(false)

  const handleAddProperty = (property) => {
    if (!selectedProperties.some((p) => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property])
      setShowAddProperty(false)
    }
  }

  const handleRemoveProperty = (propertyId) => {
    setSelectedProperties(selectedProperties.filter((p) => p.id !== propertyId))
  }

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
        {selectedProperties.length < 4 && (
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

        {/* Property Selection Modal */}
        {showAddProperty && (
          <div className="mb-8 bg-card p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground">Select Properties</h2>
              <button
                onClick={() => setShowAddProperty(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {mockProperties
                .filter((p) => !selectedProperties.some((sp) => sp.id === p.id))
                .map((property) => (
                  <button
                    key={property.id}
                    onClick={() => handleAddProperty(property)}
                    className="text-left p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{property.area}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      LKR {property.price.toLocaleString()}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {selectedProperties.length > 0 ? (
          <>
            {/* Comparison Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {/* Property Cards */}
                    <tr className="border-b border-border">
                      <td className="p-4 font-semibold text-foreground w-32 bg-secondary">Property</td>
                      {selectedProperties.map((property) => (
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
                            src={property.image}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Price */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Price/Month</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          <p className="text-xl font-bold text-primary">
                            LKR {property.price.toLocaleString()}
                          </p>
                        </td>
                      ))}
                    </tr>

                    {/* Rental Value Score */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">RVS</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold">
                            {property.rentValueScore}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Bedrooms */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Bedrooms</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-foreground">
                          {property.bedrooms}
                        </td>
                      ))}
                    </tr>

                    {/* Bathrooms */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Bathrooms</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-foreground">
                          {property.bathrooms}
                        </td>
                      ))}
                    </tr>

                    {/* Square Feet */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Square Feet</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-foreground">
                          {property.squareFeet}
                        </td>
                      ))}
                    </tr>

                    {/* Distance */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Distance (km)</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-foreground">
                          {property.distance}
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Rating</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-foreground">
                              {property.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({property.reviews})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Facilities */}
                    <tr className="border-b border-border hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Facilities</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {property.facilities.map((facility) => (
                              <span
                                key={facility}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Issues */}
                    <tr className="hover:bg-secondary/50">
                      <td className="p-4 font-semibold text-foreground bg-secondary">Issues</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          {property.complaintCount > 0 ? (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {property.complaintCount} complaint{property.complaintCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check className="w-5 h-5" />
                              <span className="text-sm">No issues</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card p-12 rounded-lg border border-border text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No properties selected</h3>
            <p className="text-muted-foreground mb-6">
              Add properties to compare their features, prices, and ratings
            </p>
            <button
              onClick={() => onNavigate('listings')}
              className="btn-primary"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

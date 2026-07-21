import { useState } from 'react'
import { Zap, TrendingUp, Target, AlertCircle } from 'lucide-react'
import { mockProperties } from '@/lib/mockData'
import PropertyCard from '@/components/PropertyCard'

export default function BudgetAdvisor({ onNavigate }) {
  const [budget, setBudget] = useState(50000)
  const [bedrooms, setBedrooms] = useState('')
  const [area, setArea] = useState('')
  const [priority, setPriority] = useState('balanced')

  const areas = [...new Set(mockProperties.map((p) => p.area))]

  // Calculate recommendations based on budget
  const getRecommendations = () => {
    let filtered = mockProperties.filter((p) => p.price <= budget)

    if (bedrooms) {
      filtered = filtered.filter((p) => p.bedrooms === parseInt(bedrooms))
    }

    if (area) {
      filtered = filtered.filter((p) => p.area === area)
    }

    // Sort by priority
    if (priority === 'value') {
      filtered.sort((a, b) => b.rentValueScore - a.rentValueScore)
    } else if (priority === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (priority === 'cheapest') {
      filtered.sort((a, b) => a.price - b.price)
    } else {
      // balanced - mix of all factors
      filtered.sort((a, b) => {
        const scoreA = (a.rentValueScore * 0.4 + a.rating * 20 * 0.3 + (1 - a.price / 150000) * 100 * 0.3)
        const scoreB = (b.rentValueScore * 0.4 + b.rating * 20 * 0.3 + (1 - b.price / 150000) * 100 * 0.3)
        return scoreB - scoreA
      })
    }

    return filtered.slice(0, 6)
  }

  const recommendations = getRecommendations()

  // Calculate budget insights
  const avgPriceInBudget = Math.round(
    mockProperties
      .filter((p) => p.price <= budget)
      .reduce((acc, p) => acc + p.price, 0) / mockProperties.filter((p) => p.price <= budget).length || 0
  )

  const propertiesWithinBudget = mockProperties.filter((p) => p.price <= budget).length

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Budget-Based Advisor</h1>
          <p className="text-muted-foreground">
            Get personalized property recommendations based on your budget
          </p>
        </div>

        {/* Budget Calculator */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 p-8 rounded-lg border border-primary/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Monthly Budget (LKR)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">LKR 10,000</span>
                    <span className="text-2xl font-bold text-primary">
                      LKR {budget.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">LKR 150,000</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Preferred Bedrooms
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

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Preferred Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Area</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input-field"
                >
                  <option value="balanced">Balanced (Value + Rating)</option>
                  <option value="value">Best Value Score</option>
                  <option value="rating">Highest Rated</option>
                  <option value="cheapest">Cheapest</option>
                </select>
              </div>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Properties in Budget</p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {propertiesWithinBudget}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available listings matching your budget
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Average Price</p>
                    <p className="text-3xl font-bold text-accent mt-1">
                      LKR {avgPriceInBudget.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Among properties in your budget
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Tip: Properties with high rental value scores offer better amenities and location convenience relative to their price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Recommended Properties
            {recommendations.length === 0 && <span className="text-base text-muted-foreground"> - No matches found</span>}
          </h2>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => onNavigate('property', property.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card p-12 rounded-lg border border-border text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No properties match your criteria
              </h3>
              <p className="text-muted-foreground mb-6">
                Try increasing your budget, adjusting bedroom preferences, or selecting a different area
              </p>
              <button
                onClick={() => onNavigate('listings')}
                className="btn-primary"
              >
                Browse All Properties
              </button>
            </div>
          )}
        </div>

        {/* Budget Tips */}
        <div className="mt-12 bg-card p-8 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Budget Planning Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">1. Consider Hidden Costs</h3>
              <p className="text-sm text-muted-foreground">
                Budget for utilities, maintenance, and deposits when calculating your total rental expenses.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">2. Location Matters</h3>
              <p className="text-sm text-muted-foreground">
                Properties with good ratings tend to have fewer issues and better landlord responsiveness.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">3. Check Complaint Patterns</h3>
              <p className="text-sm text-muted-foreground">
                Review tenant complaints to identify recurring issues and make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

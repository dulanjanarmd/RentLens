import { AlertTriangle, TrendingDown, TrendingUp, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function RiskAnalyzer({ property }) {
  // Calculate risk scores based on various factors
  const riskFactors = {
    location: {
      name: 'Location Risk',
      score: calculateLocationRisk(property.area),
      description: 'Based on area safety and accessibility',
      icon: AlertTriangle,
    },
    maintenance: {
      name: 'Maintenance Risk',
      score: Math.max(0, 100 - property.rating * 10),
      description: 'Based on property condition and reviews',
      icon: AlertCircle,
    },
    complaints: {
      name: 'Tenant Complaints Risk',
      score: Math.min(100, property.complaintCount * 5),
      description: `${property.complaintCount} complaints registered`,
      icon: AlertTriangle,
    },
    landlord: {
      name: 'Landlord Reliability',
      score: 100 - Math.abs(property.landlordRating - 4.5) * 10,
      description: 'Based on landlord responsiveness score',
      icon: CheckCircle,
    },
    priceVolatility: {
      name: 'Price Volatility',
      score: Math.random() * 30 + 40, // Simulated volatility
      description: 'Market price stability for this area',
      icon: TrendingUp,
    },
    amenities: {
      name: 'Amenity Coverage',
      score: (property.facilities.length / 10) * 100,
      description: `${property.facilities.length} facilities available`,
      icon: CheckCircle,
    },
  }

  const overallRisk = Math.round(
    Object.values(riskFactors).reduce((sum, factor) => sum + factor.score, 0) / 
    Object.values(riskFactors).length
  )

  const getRiskLevel = (score) => {
    if (score < 25) return { label: 'Very Low', color: 'text-green-600', bg: 'bg-green-100', icon: '✓' }
    if (score < 45) return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: '✓' }
    if (score < 60) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠' }
    if (score < 75) return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100', icon: '!' }
    return { label: 'Very High', color: 'text-red-600', bg: 'bg-red-100', icon: '✕' }
  }

  const overallLevel = getRiskLevel(overallRisk)

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
          <AlertTriangle className="w-6 h-6 text-primary" />
          Property Risk Assessment
        </h2>
        <p className="text-muted-foreground text-sm">
          Comprehensive analysis based on multiple factors
        </p>
      </div>

      {/* Overall Risk Score */}
      <div className={`${overallLevel.bg} rounded-lg p-6 border-l-4 ${overallLevel.color} border`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Overall Risk Score
            </p>
            <p className={`text-4xl font-bold ${overallLevel.color}`}>
              {overallRisk}%
            </p>
            <p className={`text-lg font-semibold ${overallLevel.color} mt-2`}>
              {overallLevel.label} Risk
            </p>
          </div>
          <div className={`text-6xl opacity-20 ${overallLevel.color}`}>
            {overallLevel.icon}
          </div>
        </div>
      </div>

      {/* Risk Recommendation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">
              Risk Assessment Recommendation
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {overallRisk < 35
                ? 'This property presents a low risk profile. It appears to be well-maintained with minimal complaints and good management.'
                : overallRisk < 60
                ? 'This property has moderate risk factors. Review the specific concerns below before making a decision.'
                : 'This property has elevated risk factors. We recommend thorough inspection and verification before committing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(riskFactors).map((factor) => {
          const Icon = factor.icon
          const level = getRiskLevel(factor.score)
          const isGood = factor.score < 50

          return (
            <div
              key={factor.name}
              className="bg-secondary/50 border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${level.color}`} />
                  <p className="font-medium text-foreground text-sm">{factor.name}</p>
                </div>
                <span className={`text-2xl font-bold ${level.color}`}>
                  {Math.round(factor.score)}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    factor.score < 25
                      ? 'bg-green-500'
                      : factor.score < 50
                      ? 'bg-yellow-500'
                      : factor.score < 75
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, factor.score)}%` }}
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">{factor.description}</p>
                <p className={`text-xs font-medium ${level.color} mt-1`}>
                  {level.label} Risk
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Risk Mitigation Tips */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Tips to Mitigate Risks
        </h4>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
          <li>• Get a written lease agreement with clear terms</li>
          <li>• Document property condition before moving in (photos/videos)</li>
          <li>• Verify landlord details and credentials</li>
          <li>• Visit the property multiple times at different hours</li>
          <li>• Talk to current/former tenants if possible</li>
          <li>• Check water, electricity, and internet connectivity</li>
          <li>• Ensure security deposits are protected by law</li>
        </ul>
      </div>
    </div>
  )
}

function calculateLocationRisk(area) {
  const areaRiskMap = {
    'Colombo': 35,
    'Kandy': 30,
    'Galle': 25,
    'Negombo': 40,
    'Jaffna': 45,
  }
  return areaRiskMap[area] || 50
}

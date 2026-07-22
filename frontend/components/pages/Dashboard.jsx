import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { useEffect, useState } from 'react'
import { TrendingUp, AlertCircle, Home, Loader2 } from 'lucide-react'
import { getMarketDashboard } from '@/lib/api'

// Static 6-month price trend (kept as-is since backend is v1)
const priceHistory = [
  { month: 'Jan', average: 42000, median: 40000 },
  { month: 'Feb', average: 43000, median: 41000 },
  { month: 'Mar', average: 44500, median: 42500 },
  { month: 'Apr', average: 45000, median: 44000 },
  { month: 'May', average: 46000, median: 45000 },
  { month: 'Jun', average: 48000, median: 46500 },
]

const TAG_LABELS = {
  water_issues:          'Water Issues',
  noise:                 'Noise',
  maintenance_delays:    'Maintenance Delays',
  landlord_unresponsive: 'Unresponsive Landlord',
  overcrowding:          'Overcrowding',
  power_issues:          'Power Issues',
}

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard({ onNavigate }) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setLoading(true)
    getMarketDashboard()
      .then(setDashboard)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading market analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Failed to load dashboard</h1>
          <p className="text-muted-foreground text-sm">{error} — make sure the backend is running on port 8080.</p>
        </div>
      </div>
    )
  }

  const areaStats     = dashboard?.areaStats || []
  const complaints    = dashboard?.complaintPatterns || []
  const totalProps    = dashboard?.totalProperties || 0

  const avgPrice = areaStats.length
    ? Math.round(areaStats.reduce((acc, a) => acc + a.avgPrice, 0) / areaStats.length)
    : 0

  const avgRating = areaStats.length
    ? (areaStats.reduce((acc, a) => acc + a.avgRating, 0) / areaStats.length).toFixed(2)
    : '0.00'

  const maxComplaintCount = complaints[0]?.count || 1

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Market Analytics</h1>
          <p className="text-muted-foreground">
            Live insights from {totalProps} properties in the rental market
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Average Rent</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">LKR {avgPrice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Per month</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Properties</p>
              <Home className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalProps}</p>
            <p className="text-xs text-muted-foreground mt-2">Listed on platform</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avgRating}/5</p>
            <p className="text-xs text-muted-foreground mt-2">Community rating</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Areas Covered</p>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{areaStats.length}+</p>
            <p className="text-xs text-muted-foreground mt-2">Regions monitored</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Price Trend */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Price Trend (6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Average" />
                <Line type="monotone" dataKey="median"  stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} name="Median" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Price by Area */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Average Price by Area</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...areaStats].sort((a, b) => b.avgPrice - a.avgPrice).slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="area" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="avgPrice" fill="#3b82f6" name="Avg Price" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaint Patterns */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Top Complaint Patterns
            </h2>
            <div className="space-y-3">
              {complaints.length === 0 ? (
                <p className="text-sm text-muted-foreground">No complaints recorded yet.</p>
              ) : (
                complaints.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {TAG_LABELS[pattern.tag] || pattern.tag}
                      </p>
                      <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(pattern.count / maxComplaintCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground ml-4 w-12 text-right">
                      {pattern.count}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Properties by Area Pie */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Properties by Area</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ area, propertyCount }) => `${area}: ${propertyCount}`}
                  outerRadius={80}
                  dataKey="propertyCount"
                >
                  {areaStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Rankings Table */}
        <div className="bg-card p-6 rounded-lg border border-border mt-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Area Rankings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Area</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Properties</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {[...areaStats]
                  .sort((a, b) => b.avgPrice - a.avgPrice)
                  .map((area, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-foreground font-medium">{area.area}</td>
                      <td className="py-3 px-4 text-foreground">
                        LKR {Math.round(area.avgPrice).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-foreground">{area.propertyCount}</td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          ★ {area.avgRating.toFixed(1)}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

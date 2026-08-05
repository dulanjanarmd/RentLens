import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts'
import { useEffect, useState } from 'react'
import { TrendingUp, AlertCircle, Home, Loader2, MapPin, Building2, Sofa, Star } from 'lucide-react'
import { getMarketDashboard, getProperties } from '@/lib/api'

const TAG_LABELS = {
  water_issues:          'Water Issues',
  noise:                 'Noise',
  maintenance_delays:    'Maintenance Delays',
  landlord_unresponsive: 'Unresponsive Landlord',
  overcrowding:          'Overcrowding',
  power_issues:          'Power Issues',
}

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
const TYPE_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [topProperties, setTopProperties] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getMarketDashboard(),
      getProperties() // default fetch returns ranked by RVS
    ])
      .then(([dashData, propsData]) => {
        setDashboard(dashData)
        setTopProperties(propsData.slice(0, 5))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading advanced analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Failed to load dashboard</h1>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const areaStats      = dashboard?.areaStats || []
  const complaints     = dashboard?.complaintPatterns || []
  const totalProps     = dashboard?.totalProperties || 0
  const priceHistory   = dashboard?.priceHistory || []
  const typeStats      = dashboard?.typeStats || []
  const furnishedStats = dashboard?.furnishedStats || []
  const bedroomStats   = dashboard?.bedroomStats || []
  const rvsBuckets     = dashboard?.rvsBuckets || {}
  const globalAvgRent  = dashboard?.globalAvgRent || 0
  const topArea        = dashboard?.topArea || 'N/A'

  const maxComplaintCount = complaints[0]?.count || 1

  // Format RVS Data for Recharts
  const rvsChartData = Object.entries(rvsBuckets).map(([range, count]) => ({
    range,
    count
  }))

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive market intelligence derived from {totalProps} active property listings.
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
            <p className="text-3xl font-bold text-foreground">{totalProps}</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Global Average Rent</p>
            <p className="text-3xl font-bold text-foreground">LKR {Math.round(globalAvgRent).toLocaleString()}</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Top Rated Area</p>
            <p className="text-3xl font-bold text-foreground">{topArea}</p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Areas Monitored</p>
            <p className="text-3xl font-bold text-foreground">{areaStats.length}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Price Trend (Spans 2 cols) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-6">Market Price Trend (6 Months)</h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `LKR ${val/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Average Rent" />
                  <Line type="monotone" dataKey="median"  stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} name="Median Rent" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Types (1 col) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Property Distribution
            </h2>
            <div className="h-[350px] flex items-center justify-center">
              {typeStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="propertyType"
                    >
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">Not enough data to display.</p>
              )}
            </div>
          </div>

          {/* Price by Area (Spans 2 cols) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-6">Average Rent by Area</h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="area" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `LKR ${val/1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                    formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Avg Rent']}
                  />
                  <Bar dataKey="avgPrice" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Furnishing Premium (1 col) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Sofa className="w-5 h-5 text-primary" /> Furnishing Premium
            </h2>
            <div className="h-[350px]">
              {furnishedStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={furnishedStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                    <YAxis dataKey="status" type="category" stroke="#64748b" axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                      formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Avg Rent']}
                    />
                    <Bar dataKey="avgPrice" radius={[0, 4, 4, 0]} maxBarSize={40}>
                      {furnishedStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'Furnished' ? '#8b5cf6' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground flex items-center justify-center h-full">Not enough data to display.</p>
              )}
            </div>
          </div>

          {/* Rent by Bedrooms (1 col) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" /> Rent by Bedrooms
            </h2>
            <div className="h-[350px]">
              {bedroomStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bedroomStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="bedrooms" stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${val} Bed${val > 1 ? 's' : ''}`} />
                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                      formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Avg Rent']}
                      labelFormatter={(val) => `${val} Bedroom${val > 1 ? 's' : ''}`}
                    />
                    <Bar dataKey="avgPrice" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground flex items-center justify-center h-full">Not enough data to display.</p>
              )}
            </div>
          </div>

          {/* RVS Distribution (Spans 2 cols) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Rent Value Score (RVS) Distribution
            </h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rvsChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="range" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" name="Properties" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Ranked Properties Table (Spans 3 cols) */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-3">
            <h2 className="text-lg font-bold text-foreground mb-6">Top 5 Highest Ranked Properties</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="text-xs uppercase bg-secondary/50 text-foreground">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Property</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Rent / Month</th>
                    <th className="px-4 py-3 text-center">Score (RVS)</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topProperties.length > 0 ? (
                    topProperties.map((prop, idx) => {
                      const scoreColor = prop.rentValueScore >= 80 ? 'bg-green-100 text-green-700 border-green-200' 
                                      : prop.rentValueScore >= 60 ? 'bg-amber-100 text-amber-700 border-amber-200' 
                                      : 'bg-red-100 text-red-700 border-red-200';
                      return (
                        <tr key={prop.id || idx} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-4 font-medium text-foreground">{prop.title}</td>
                          <td className="px-4 py-4">{prop.area}</td>
                          <td className="px-4 py-4">LKR {prop.price?.toLocaleString()}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scoreColor}`}>
                              {Math.round(prop.rentValueScore)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right flex items-center justify-end gap-1">
                            {prop.rating?.toFixed(1) || '0.0'}
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">No properties available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Complaint Patterns */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm lg:col-span-3">
            <h2 className="text-lg font-bold text-foreground mb-6">Most Common Tenant Complaints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.slice(0, 6).map((c, idx) => (
                <div key={c.tag} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{TAG_LABELS[c.tag] || c.tag}</span>
                      <span className="text-sm text-muted-foreground">{c.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(c.count / maxComplaintCount) * 100}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {complaints.length === 0 && (
              <p className="text-muted-foreground">No complaint data available yet.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}

import { useState, useEffect } from 'react'
import { getMarketDashboard, getAllReviews } from '@/lib/api'
import { Building2, MessageSquare, Star, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalReviews: 0,
    averageRating: 0,
    totalComplaints: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboard, reviews] = await Promise.all([
          getMarketDashboard(),
          getAllReviews()
        ])
        
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
        const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0
        const totalComplaints = dashboard.complaintPatterns?.reduce((sum, p) => sum + p.count, 0) || 0

        setStats({
          totalProperties: dashboard.totalProperties || 0,
          totalReviews: reviews.length,
          averageRating: avgRating,
          totalComplaints
        })
      } catch (err) {
        console.error('Failed to load admin dashboard data', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>
  }

  const statCards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Average Rating', value: `${stats.averageRating} / 5.0`, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Total Complaints', value: stats.totalComplaints, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

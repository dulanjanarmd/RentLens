

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Home from '@/components/pages/Home'
import Listings from '@/components/pages/Listings'
import PropertyDetail from '@/components/pages/PropertyDetail'
import Comparison from '@/components/pages/Comparison'
import Dashboard from '@/components/pages/Dashboard'
import BudgetAdvisor from '@/components/pages/BudgetAdvisor'
import AddProperty from '@/components/pages/AddProperty'
import MapSearch from '@/components/pages/MapSearch'
import Profile from '@/components/pages/Profile'
import Login from '@/components/pages/Login'
import Signup from '@/components/pages/Signup'

import AdminLayout from '@/components/pages/admin/AdminLayout'
import AdminDashboard from '@/components/pages/admin/AdminDashboard'
import AdminProperties from '@/components/pages/admin/AdminProperties'
import AdminReviews from '@/components/pages/admin/AdminReviews'
import AdminInquiries from '@/components/pages/admin/AdminInquiries'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Outlet />
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget-advisor" element={<BudgetAdvisor />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/map-search" element={<MapSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
      </Routes>
    </Router>
  )
}



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
import About from '@/components/pages/About'
import Contact from '@/components/pages/Contact'
import BlogList from '@/components/pages/BlogList'
import BlogPostView from '@/components/pages/BlogPostView'
import PrivacyPolicy from '@/components/pages/PrivacyPolicy'
import TermsOfService from '@/components/pages/TermsOfService'
import CookiePolicy from '@/components/pages/CookiePolicy'
import HelpCenter from '@/components/pages/HelpCenter'

import AdminLayout from '@/components/pages/admin/AdminLayout'
import AdminDashboard from '@/components/pages/admin/AdminDashboard'
import AdminProperties from '@/components/pages/admin/AdminProperties'
import AdminReviews from '@/components/pages/admin/AdminReviews'
import AdminInquiries from '@/components/pages/admin/AdminInquiries'
import AdminBlog from '@/components/pages/admin/AdminBlog'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function MainLayout() {
  const location = useLocation()
  const isImmersivePage = ['/', '/login', '/signup'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className={isImmersivePage ? '' : 'pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'}>
        <Outlet />
      </div>
    </div>
  )
}

function AdminRoute() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <AdminLayout />
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPostView />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="blog" element={<AdminBlog />} />
        </Route>
      </Routes>
    </Router>
  )
}

'use client'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Home from '@/components/pages/Home'
import Listings from '@/components/pages/Listings'
import PropertyDetail from '@/components/pages/PropertyDetail'
import Comparison from '@/components/pages/Comparison'
import Dashboard from '@/components/pages/Dashboard'
import BudgetAdvisor from '@/components/pages/BudgetAdvisor'

export default function AppWrapper() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget-advisor" element={<BudgetAdvisor />} />
        </Routes>
      </div>
    </Router>
  )
}

'use client'

import { useState } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import Navigation from '@/components/Navigation'
import Home from '@/components/pages/Home'
import Listings from '@/components/pages/Listings'
import PropertyDetail from '@/components/pages/PropertyDetail'
import Comparison from '@/components/pages/Comparison'
import Dashboard from '@/components/pages/Dashboard'
import BudgetAdvisor from '@/components/pages/BudgetAdvisor'
import Login from '@/components/pages/Login'
import Signup from '@/components/pages/Signup'
import Profile from '@/components/pages/Profile'
import MapSearch from '@/components/pages/MapSearch'
import ChatAssistant from '@/components/ChatAssistant'

function AppContent({ currentPage, propertyId, handleNavigate }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />
      <ChatAssistant />
      
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'listings' && <Listings onNavigate={handleNavigate} />}
      {currentPage === 'property' && propertyId && <PropertyDetail id={propertyId} onNavigate={handleNavigate} />}
      {currentPage === 'comparison' && <Comparison onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'budget-advisor' && <BudgetAdvisor onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <Signup onNavigate={handleNavigate} />}
      {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
      {currentPage === 'map-search' && <MapSearch onNavigate={handleNavigate} />}
    </div>
  )
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState('home')
  const [propertyId, setPropertyId] = useState(null)

  const handleNavigate = (page, id = null) => {
    setCurrentPage(page)
    if (id) setPropertyId(id)
    window.scrollTo(0, 0)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent currentPage={currentPage} propertyId={propertyId} handleNavigate={handleNavigate} />
      </AuthProvider>
    </ThemeProvider>
  )
}

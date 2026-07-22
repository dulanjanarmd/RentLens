import { useState } from 'react'
import { Menu, X, Home, Building2, TrendingUp, Zap, BarChart3, MapPin, User, PlusCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navigation({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const links = [
    { page: 'home', label: 'Home', icon: Home },
    { page: 'listings', label: 'Listings', icon: Building2 },
    { page: 'add-property', label: 'List Property', icon: PlusCircle },
    { page: 'map-search', label: 'Map Search', icon: MapPin },
    { page: 'comparison', label: 'Compare', icon: TrendingUp },
    { page: 'budget-advisor', label: 'Budget Tool', icon: Zap },
    { page: 'dashboard', label: 'Market Analytics', icon: BarChart3 },
  ]

  const handleClick = (page) => {
    onNavigate(page)
    setIsOpen(false)
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => handleClick('home')} className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity">
            <MapPin className="w-6 h-6" />
            RentLens
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <button
                  key={link.page}
                  onClick={() => handleClick(link.page)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              )
            })}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => handleClick('profile')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-5 h-5 rounded-full"
                />
                {user.name}
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleClick('login')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleClick('signup')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <button
                  key={link.page}
                  onClick={() => handleClick(link.page)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              )
            })}
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              <div className="flex justify-between items-center px-3 py-2">
                <span className="text-sm font-medium text-foreground">Theme</span>
                <ThemeToggle />
              </div>
              {user ? (
                <button
                  onClick={() => handleClick('profile')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleClick('login')}
                    className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleClick('signup')}
                    className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

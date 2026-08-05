import { useState } from 'react'
import { Menu, X, Home, Building2, TrendingUp, Zap, BarChart3, MapPin, User, PlusCircle, Aperture, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ThemeToggle from '@/components/ThemeToggle'
import { useAppNavigation } from '@/hooks/useAppNavigation'

export default function Navigation() {
  const onNavigate = useAppNavigation()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const links = [
    { page: 'home', label: 'Home', icon: Home },
    { page: 'listings', label: 'Listings', icon: Building2 },
    { page: 'map-search', label: 'Map Search', icon: MapPin },
    { page: 'comparison', label: 'Compare', icon: TrendingUp },
    { page: 'budget-advisor', label: 'Budget Tool', icon: Zap },
    { page: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { page: 'blog', label: 'Blog', icon: MapPin },
    { page: 'about', label: 'About', icon: TrendingUp },
    { page: 'contact', label: 'Contact', icon: Zap },
    { page: 'add-property', label: 'List Property', icon: PlusCircle },
  ]

  const handleClick = (page) => {
    onNavigate(page)
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto bg-background/80 dark:bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <button onClick={() => handleClick('home')} className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity shrink-0">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <Aperture className="w-6 h-6" />
            </div>
            RentLens
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {links.map((link) => {
              return (
                <button
                  key={link.page}
                  onClick={() => handleClick(link.page)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-full transition-all whitespace-nowrap"
                >
                  {link.label}
                </button>
              )
            })}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <ThemeToggle />
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => handleClick('admin')}
                    className="px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors"
                  >
                    Admin
                  </button>
                )}
                <button
                  onClick={() => handleClick('profile')}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 border border-border bg-background hover:bg-muted text-foreground rounded-full transition-all shadow-sm group"
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-border group-hover:border-primary transition-colors"
                  />
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleClick('login')}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleClick('signup')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-secondary rounded-lg text-foreground"
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
          <div className="lg:hidden pb-4 space-y-2 mt-2">
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
                <>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => handleClick('admin')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => handleClick('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </>
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

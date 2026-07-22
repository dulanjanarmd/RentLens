import { useState, useEffect } from 'react'
import { User, Mail, LogOut, Heart, Clock, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
// Removed mockProperties import
import PropertyCard from '@/components/PropertyCard'

export default function Profile({ onNavigate }) {
  const { user, logout, favorites } = useAuth()
  const [activeTab, setActiveTab] = useState('favorites')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <button onClick={() => onNavigate('login')} className="btn-primary">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const [properties, setProperties] = useState([])
  useEffect(() => {
    fetch('http://localhost:8080/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error(err))
  }, [])

  const favoriteProperties = properties.filter((p) =>
    favorites.includes(p.id)
  )

  const handleLogout = () => {
    logout()
    onNavigate('home')
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-primary"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-border">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'favorites'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className="w-4 h-4" />
              Saved Properties ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-4 h-4" />
              Recently Viewed
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => onNavigate('property', property.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-lg border border-border text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No saved properties
                </h3>
                <p className="text-muted-foreground mb-6">
                  Save your favorite properties to view them later
                </p>
                <button
                  onClick={() => onNavigate('listings')}
                  className="btn-primary"
                >
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-card p-12 rounded-lg border border-border text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Recently viewed properties
            </h3>
            <p className="text-muted-foreground">
              Your recently viewed properties will appear here
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-card rounded-xl border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="input-field bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Notifications
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm text-foreground">
                    Send me listings matching my preferences
                  </span>
                </label>
              </div>
              <button
                onClick={() => setActiveTab('favorites')}
                className="btn-primary"
              >
                Back to Favorites
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

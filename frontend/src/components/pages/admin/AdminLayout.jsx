import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Home, MessageSquare, ArrowLeft } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Properties', path: '/admin/properties', icon: Home },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            Back to App
          </Link>
        </div>
        <div className="p-4">
          <h2 className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

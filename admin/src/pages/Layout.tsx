import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Package, UserPlus, LogOut, Store, ChevronDown, Tags, Layers } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products', end: false },
  { to: '/admin/categories', icon: Tags, label: 'Categories', end: false },
  { to: '/admin/collections', icon: Layers, label: 'Collections', end: false },
  { to: '/admin/admins', icon: UserPlus, label: 'Admins', end: false },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenu, setUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-page flex">
      <aside className="w-60 bg-sidebar flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-white/5">
          <div className="w-7 h-7 bg-shopify rounded flex items-center justify-center">
            <Store size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">MS Furniture</span>
        </div>

        <div className="px-3 pt-4 pb-2">
          <p className="text-text-muted/50 text-[11px] font-medium uppercase tracking-wider px-2">Main Menu</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {links.map(l => (
            <NavLink
              key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-all ${
                  isActive
                    ? 'bg-shopify/15 text-shopify-light font-medium'
                    : 'text-text-muted hover:text-white hover:bg-sidebar-hover'
                }`
              }
            >
              <l.icon size={17} strokeWidth={1.8} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-text-muted hover:text-white hover:bg-sidebar-hover transition-colors"
            >
              <div className="w-7 h-7 bg-shopify/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-shopify-light uppercase">{user?.username?.[0] || 'A'}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-white font-medium">{user?.username}</p>
                <p className="text-[11px] text-text-muted">Admin</p>
              </div>
              <ChevronDown size={14} />
            </button>
            {userMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-page-border py-1">
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-14 bg-white border-b border-page-border flex items-center justify-between px-6">
          <h2 className="text-text-primary font-medium text-sm">Admin Panel</h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

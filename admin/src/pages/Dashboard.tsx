import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Package, Tag, Clock, Star, TrendingUp } from 'lucide-react'

interface Stats {
  totalProducts: number
  categories: number
  featured: number
  latestProduct: string | null
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [latest, setLatest] = useState<any[]>([])

  useEffect(() => {
    api('/api/products').then(products => {
      const arr = Array.isArray(products) ? products : []
      setStats({
        totalProducts: arr.length,
        categories: new Set(arr.map((p: any) => p.category)).size,
        featured: arr.filter((p: any) => p.featured).length,
        latestProduct: arr.length > 0 ? arr[arr.length - 1].name : null,
      })
      const sorted = [...arr].sort((a: any, b: any) => new Date(b.created_at || b.date_added).getTime() - new Date(a.created_at || a.date_added).getTime())
      setLatest(sorted.slice(0, 5))
    })
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-shopify/30 border-t-shopify rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-0.5">Overview of your furniture store</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'totalProducts', icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/products' },
          { key: 'categories', icon: Tag, label: 'Categories', value: stats.categories, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/categories' },
          { key: 'featured', icon: Star, label: 'Featured', value: stats.featured, color: 'text-yellow-600', bg: 'bg-yellow-50', link: '/admin/products' },
          { key: 'latestProduct', icon: Clock, label: 'Latest Product', value: stats.latestProduct || 'No products yet', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ icon: Icon, label, value, color, bg, link }) => (
          <div key={label} className="shopify-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-semibold text-text-primary">{typeof value === 'string' ? '' : value}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {typeof value === 'string' ? value : label}
                </p>
              </div>
              <div className={`w-10 h-10 ${bg} ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={20} />
              </div>
            </div>
            {link && (
              <div className="mt-3 pt-3 border-t border-page-border">
                <Link to={link} className="flex items-center gap-1.5 text-xs text-shopify hover:underline">
                  <TrendingUp size={13} />
                  <span>View all →</span>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

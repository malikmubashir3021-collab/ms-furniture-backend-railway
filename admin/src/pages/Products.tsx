import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, apiUrl } from '../api'
import { Pencil, Trash2, Plus, Search, Star, StarOff, Package } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  image: string
  images: string[]
  model_number: string
  badge: string
  featured: number
  price: number
  sale_price: number | null
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const load = () => {
    setLoading(true)
    api('/api/products').then(data => setProducts(Array.isArray(data) ? data : [])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const toggleFeatured = async (p: Product) => {
    await api(`/api/products/${p.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...p, featured: p.featured ? 0 : 1 }),
    })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await api(`/api/products/${id}`, { method: 'DELETE' })
    load()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.model_number?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Products</h1>
          <p className="text-text-secondary text-sm mt-0.5">{products.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="shopify-input pl-9 w-64"
            />
          </div>
          <Link to="/admin/products/new" className="shopify-btn-primary inline-flex items-center gap-1.5">
            <Plus size={15} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="shopify-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-page-border text-text-secondary text-xs font-medium uppercase tracking-wider">
                <th className="text-left px-4 py-3 w-12"></th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Model</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3">Featured</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-page-border last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="pl-4 py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded border border-page-border overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={apiUrl(p.image)} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div>
                      <Link to={`/admin/products/${p.id}/edit`} className="font-medium text-text-primary hover:text-shopify transition-colors">
                        {p.name}
                      </Link>
                      <p className="text-text-muted text-xs mt-0.5">ID: {p.id} {p.model_number ? `· ${p.model_number}` : ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-shopify/5 text-shopify">
                      {p.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs font-mono">{p.model_number || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {p.badge === 'new' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">New</span>}
                      {p.badge === 'best-seller' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">Best</span>}
                      {p.badge === 'sale' && <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Sale</span>}
                      {!p.badge && <span className="text-text-muted text-[10px]">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`p-1.5 rounded-md transition-all ${
                        p.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-text-muted hover:text-yellow-500 hover:bg-gray-100'
                      }`}
                      title={p.featured ? 'Unfeature' : 'Feature'}
                    >
                      {p.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                    </button>
                  </td>
                  <td className="pr-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/${p.id}/edit`} className="p-2 text-text-muted hover:text-shopify hover:bg-shopify/5 rounded-md transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-shopify/30 border-t-shopify rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              )}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={32} className="text-text-muted/20" />
                      <p className="text-text-secondary text-sm">
                        {search ? 'No products match your search' : 'No products yet'}
                      </p>
                      {!search && (
                        <Link to="/admin/products/new" className="text-shopify text-sm font-medium hover:underline">
                          Add your first product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

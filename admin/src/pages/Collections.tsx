import { useEffect, useState } from 'react'
import { api, apiUrl } from '../api'
import { Plus, Pencil, Trash2, X, Package, ExternalLink } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

interface Collection {
  id: number
  name: string
  description: string
  image: string
  display_order: number
  product_count?: number
  products?: any[]
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Collection | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '', display_order: 0 })
  const [saving, setSaving] = useState(false)
  const [manageCollection, setManageCollection] = useState<Collection | null>(null)
  const [allProducts, setAllProducts] = useState<any[]>([])

  const load = () => {
    api('/api/collections').then(setCollections)
  }
  useEffect(load, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', image: '', display_order: 0 })
    setShowForm(true)
  }

  const openEdit = (col: Collection) => {
    setEditing(col)
    setForm({ name: col.name, description: col.description, image: col.image, display_order: col.display_order })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api(`/api/collections/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      } else {
        await api('/api/collections', { method: 'POST', body: JSON.stringify(form) })
      }
      setShowForm(false)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this collection?')) return
    await api(`/api/collections/${id}`, { method: 'DELETE' })
    load()
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const openManage = async (col: Collection) => {
    const data = await api(`/api/collections/${col.id}`)
    setManageCollection(data)
    const products = await api('/api/products')
    setAllProducts(Array.isArray(products) ? products : [])
  }

  const addProduct = async (productId: number) => {
    if (!manageCollection) return
    try {
      await api(`/api/collections/${manageCollection.id}/products`, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      })
      const data = await api(`/api/collections/${manageCollection.id}`)
      setManageCollection(data)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const removeProduct = async (productId: number) => {
    if (!manageCollection) return
    await api(`/api/collections/${manageCollection.id}/products/${productId}`, { method: 'DELETE' })
    const data = await api(`/api/collections/${manageCollection.id}`)
    setManageCollection(data)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Collections</h1>
          <p className="text-text-secondary text-sm mt-0.5">{collections.length} collections</p>
        </div>
        <button onClick={openNew} className="shopify-btn-primary inline-flex items-center gap-1.5">
          <Plus size={15} />
          Add Collection
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-page-border">
              <h2 className="text-lg font-semibold text-text-primary">{editing ? 'Edit Collection' : 'New Collection'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="shopify-label">Collection Name</label>
                <input value={form.name} onChange={set('name')} required className="shopify-input" placeholder="e.g. Summer Collection" />
              </div>
              <div>
                <label className="shopify-label">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={2} className="shopify-input" placeholder="Short description..." />
              </div>
              <div>
                <label className="shopify-label">Display Order</label>
                <input type="number" value={form.display_order} onChange={set('display_order')} className="shopify-input" />
              </div>
              <div>
                <label className="shopify-label">Collection Image</label>
                <ImageUpload current={form.image} onUpload={path => setForm(prev => ({ ...prev, image: path }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="shopify-btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="shopify-btn-primary">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {manageCollection && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50" onClick={() => setManageCollection(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-page-border shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{manageCollection.name}</h2>
                <p className="text-xs text-text-secondary">Manage products in this collection</p>
              </div>
              <button onClick={() => setManageCollection(null)} className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">Add Products</h3>
                <div className="flex flex-wrap gap-2">
                  {allProducts.filter(p => !manageCollection.products?.find((cp: any) => cp.id === p.id)).map(p => (
                    <button key={p.id} onClick={() => addProduct(p.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-shopify/5 text-shopify rounded-md hover:bg-shopify/10 transition-colors">
                      <Plus size={12} />
                      {p.name}
                    </button>
                  ))}
                  {allProducts.length === 0 && <p className="text-xs text-text-muted">No products available</p>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">Products in this Collection</h3>
                {manageCollection.products && manageCollection.products.length > 0 ? (
                  <div className="space-y-2">
                    {manageCollection.products.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-page-border">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-text-muted text-xs shrink-0">
                            {p.image ? <img src={apiUrl(p.image)} alt="" className="w-full h-full object-cover rounded" /> : <Package size={14} />}
                          </div>
                          <span className="text-sm text-text-primary truncate">{p.name}</span>
                        </div>
                        <button onClick={() => removeProduct(p.id)} className="p-1 text-text-muted hover:text-red-500 rounded hover:bg-red-50 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package size={28} className="text-text-muted/30 mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">No products in this collection yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map(col => (
          <div key={col.id} className="shopify-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {col.image ? (
                <img src={apiUrl(col.image)} alt={col.name} className="w-16 h-16 rounded-lg object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <Package size={24} className="text-purple-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary truncate">{col.name}</h3>
                {col.description && <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{col.description}</p>}
                <p className="text-xs text-text-muted mt-1">{col.product_count || 0} products</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openManage(col)} className="p-1.5 text-text-muted hover:text-shopify rounded-md hover:bg-shopify/5 transition-colors" title="Manage products">
                  <ExternalLink size={14} />
                </button>
                <button onClick={() => openEdit(col)} className="p-1.5 text-text-muted hover:text-shopify rounded-md hover:bg-shopify/5 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(col.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {collections.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
            <Package size={36} className="text-text-muted/30" />
            <p className="text-text-secondary text-sm">No collections yet</p>
            <button onClick={openNew} className="text-shopify text-sm font-medium hover:underline">Create your first collection</button>
          </div>
        )}
      </div>
    </div>
  )
}

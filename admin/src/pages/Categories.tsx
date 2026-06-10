import { useEffect, useState } from 'react'
import { api, apiUrl } from '../api'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

interface Category {
  id: number
  name: string
  image: string
  description: string
  display_order: number
  product_count?: number
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '', display_order: 0 })
  const [saving, setSaving] = useState(false)

  const load = () => {
    api('/api/categories').then(setCategories)
  }
  useEffect(load, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '', image: '', display_order: 0 })
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description, image: cat.image, display_order: cat.display_order })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api(`/api/categories/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      } else {
        await api('/api/categories', { method: 'POST', body: JSON.stringify(form) })
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
    if (!confirm('Delete this category? Products in this category will lose their category reference.')) return
    await api(`/api/categories/${id}`, { method: 'DELETE' })
    load()
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Categories</h1>
          <p className="text-text-secondary text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openNew} className="shopify-btn-primary inline-flex items-center gap-1.5">
          <Plus size={15} />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-page-border">
              <h2 className="text-lg font-semibold text-text-primary">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="shopify-label">Category Name</label>
                <input value={form.name} onChange={set('name')} required className="shopify-input" placeholder="e.g. Coffee Tables" />
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
                <label className="shopify-label">Category Image</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="shopify-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {cat.image ? (
                <img src={apiUrl(cat.image)} alt={cat.name} className="w-16 h-16 rounded-lg object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div className="w-16 h-16 bg-shopify/10 rounded-lg flex items-center justify-center shrink-0">
                  <Tag size={24} className="text-shopify" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary truncate">{cat.name}</h3>
                {cat.description && <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{cat.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-text-muted hover:text-shopify rounded-md hover:bg-shopify/5 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-text-muted hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
            <Tag size={36} className="text-text-muted/30" />
            <p className="text-text-secondary text-sm">No categories yet</p>
            <button onClick={openNew} className="text-shopify text-sm font-medium hover:underline">Create your first category</button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { ArrowLeft, Star } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

interface Category {
  id: number
  name: string
}

interface FormData {
  name: string
  category_id: string
  category: string
  description: string
  material: string
  finishing: string
  sizing: string
  color_scheme: string
  top_type: string
  model_number: string
  badge: string
  image: string
  price: string
  sale_price: string
  featured: boolean
}

const empty: FormData = {
  name: '', category_id: '', category: '', description: '', material: '',
  finishing: '', sizing: '', color_scheme: '', top_type: '',
  model_number: '', badge: '', image: '', price: '', sale_price: '', featured: false,
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api('/api/categories').then(data => setCategories(Array.isArray(data) ? data : [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (id) {
      api(`/api/products/${id}`).then(data => {
        setForm({
          name: data.name || '',
          category_id: data.category_id?.toString() || '',
          category: data.category || '',
          description: data.description || '',
          material: data.material || '',
          finishing: data.finishing || '',
          sizing: data.sizing || '',
          color_scheme: data.color_scheme || '',
          top_type: data.top_type || '',
          model_number: data.model_number || '',
          badge: data.badge || '',
          image: data.image || '',
          price: data.price?.toString() || '',
          sale_price: data.sale_price?.toString() || '',
          featured: data.featured ? true : false,
        })
      })
    }
  }, [id])

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        price: form.price ? parseFloat(form.price) : 0,
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        category_id: form.category_id ? parseInt(form.category_id) : null,
      }
      if (isEdit) {
        await api(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await api('/api/products', { method: 'POST', body: JSON.stringify(body) })
      }
      navigate('/admin/products')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const selectedCategory = categories.find(c => c.id.toString() === form.category_id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-md transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {isEdit ? 'Update product details' : 'Create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="shopify-card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text-primary pb-2 border-b border-page-border">Basic Information</h2>
              <div>
                <label className="shopify-label">Product Name</label>
                <input value={form.name} onChange={set('name')} required className="shopify-input" placeholder="e.g. Premium Coffee Table" />
              </div>
              <div>
                <label className="shopify-label">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={3} className="shopify-input" placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="shopify-label">Category</label>
                  <select value={form.category_id} onChange={e => {
                    const catId = e.target.value
                    const cat = categories.find(c => c.id.toString() === catId)
                    setForm(prev => ({ ...prev, category_id: catId, category: cat?.name || '' }))
                  }} className="shopify-select">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="shopify-label">Badge</label>
                  <select value={form.badge} onChange={set('badge')} className="shopify-select">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="best-seller">Best Seller</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="shopify-card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text-primary pb-2 border-b border-page-border">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="shopify-label">Price (PKR)</label>
                  <input type="number" value={form.price} onChange={set('price')} className="shopify-input" placeholder="e.g. 25000" />
                </div>
                <div>
                  <label className="shopify-label">Sale Price (PKR)</label>
                  <input type="number" value={form.sale_price} onChange={set('sale_price')} className="shopify-input" placeholder="Leave empty if no sale" />
                </div>
              </div>
            </div>

            <div className="shopify-card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text-primary pb-2 border-b border-page-border">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="shopify-label">Material</label>
                  <input value={form.material} onChange={set('material')} className="shopify-input" placeholder="e.g. Solid Wood" />
                </div>
                <div>
                  <label className="shopify-label">Finishing</label>
                  <input value={form.finishing} onChange={set('finishing')} className="shopify-input" placeholder="e.g. Polished" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="shopify-label">Dimensions</label>
                  <input value={form.sizing} onChange={set('sizing')} className="shopify-input" placeholder='e.g. 48" × 30" × 17"' />
                </div>
                <div>
                  <label className="shopify-label">Color Scheme</label>
                  <input value={form.color_scheme} onChange={set('color_scheme')} className="shopify-input" placeholder="e.g. Walnut Brown" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="shopify-label">Top Type</label>
                  <input value={form.top_type} onChange={set('top_type')} className="shopify-input" placeholder="e.g. Marble Top" />
                </div>
                <div>
                  <label className="shopify-label">Model Number</label>
                  <input value={form.model_number} onChange={set('model_number')} className="shopify-input" placeholder="e.g. MT-101" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="shopify-card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Product Image</h2>
              <ImageUpload current={form.image} onUpload={path => setForm(prev => ({ ...prev, image: path }))} />
              {selectedCategory && (
                <p className="text-xs text-text-muted mt-2">Category: {selectedCategory.name}</p>
              )}
            </div>

            <div className="shopify-card p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Visibility</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-shopify' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${form.featured ? 'left-5' : 'left-1'}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className={form.featured ? 'text-shopify' : 'text-text-muted'} />
                  <span className="text-sm text-text-primary">Feature this product</span>
                </div>
              </label>
              {form.featured && (
                <p className="text-xs text-shopify mt-2">Product will appear in featured sections</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" disabled={saving} className="shopify-btn-primary w-full">
                {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={() => navigate('/admin/products')} className="shopify-btn-secondary w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

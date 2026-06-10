import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { apiUrl } from '../api'

interface Props {
  current?: string
  onUpload: (path: string) => void
}

export default function ImageUpload({ current, onUpload }: Props) {
  const [preview, setPreview] = useState(current || '')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    const form = new FormData()
    form.append('image', file)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(apiUrl('/api/upload'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (data.path) {
        setPreview(data.path)
        onUpload(data.path)
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  const remove = () => {
    setPreview('')
    onUpload('')
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
        dragOver ? 'border-shopify bg-shopify/5' : 'border-page-border hover:border-shopify/50 hover:bg-gray-50'
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

      {uploading ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-8 h-8 border-2 border-shopify/30 border-t-shopify rounded-full animate-spin" />
          <span className="text-sm text-text-secondary">Uploading...</span>
        </div>
      ) : preview ? (
        <div className="relative">
          <img
            src={apiUrl(preview)}
            alt="Preview"
            className="max-h-40 mx-auto rounded object-contain"
            onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" text-anchor="middle" dominant-baseline="central" font-size="12" fill="%23999">No preview</text></svg>' }}
          />
          <button
            type="button"
            onClick={e => { e.stopPropagation(); remove() }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="w-10 h-10 bg-shopify/10 rounded-full flex items-center justify-center">
            <Upload size={18} className="text-shopify" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Drop image here or click to upload</p>
            <p className="text-xs text-text-muted mt-0.5">JPG, PNG, WebP up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  )
}

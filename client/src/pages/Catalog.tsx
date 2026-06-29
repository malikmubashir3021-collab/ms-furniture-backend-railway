import { useState, useMemo, useCallback } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { Search, X, ChevronDown } from 'lucide-react'
import SEO from '@/components/SEO'
import JsonLd from '@/components/JsonLd'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import FloatingOrbs from '@/components/FloatingOrbs'
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/products'

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'az', label: 'A–Z' },
  { id: 'newest', label: 'Newest First' },
  { id: 'bestsellers', label: 'Best Sellers' },
]

export default function Catalog() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default')
  const [sortOpen, setSortOpen] = useState(false)

  const syncParams = useCallback((cat: string, q: string, sort: string) => {
    const params = new URLSearchParams()
    if (cat !== 'all') params.set('category', cat)
    if (q.trim()) params.set('q', q.trim())
    if (sort !== 'default') params.set('sort', sort)
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ALL_PRODUCTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  const products = useMemo(() => {
    let list = [...ALL_PRODUCTS]

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'az':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        list.sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime())
        break
      case 'bestsellers':
        list.sort((a, b) => (a.salesRank || 999) - (b.salesRank || 999))
        break
    }

    return list
  }, [activeCategory, searchQuery, sortBy])

  const isFiltering = searchQuery.trim() || activeCategory !== 'all'

  return (
    <div id="main-content" className="min-h-screen bg-jet pb-20 md:pb-0 relative overflow-hidden">
      <SEO title="Collection" description="Browse our full collection of handcrafted luxury furniture pieces." canonical="/catalog" />
      <JsonLd />
      <TopStrip />
      <Navbar />
      <FloatingOrbs />

      <div className="pt-8 pb-20 container-main relative z-10">
        <div className="border-b border-gold/10 pb-8 mb-8">
          <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-2">The Collection</p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground font-light">
            All Pieces
          </h1>
          <p className="text-foreground-muted text-sm font-body mt-2">
            {ALL_PRODUCTS.length} handcrafted pieces, each a masterpiece of artisanal precision
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted/50 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search collection..."
              className="w-full bg-jet-light border border-gold/15 text-foreground/80 font-body text-sm placeholder:text-foreground-muted/30 pl-10 pr-10 py-3 tracking-wide focus:outline-none focus:border-gold/40 transition-colors duration-300"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted/50 hover:text-gold transition-colors" aria-label="Clear">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 bg-jet-light border border-gold/20 text-foreground-muted text-xs font-body tracking-wide px-3 py-3 w-full md:w-auto min-h-[44px] select-none hover:border-gold/50 transition-colors"
            >
              <span className="text-foreground-muted/50 tracking-widest uppercase">Sort:</span>
              <span>{SORT_OPTIONS.find(o => o.id === sortBy)?.label}</span>
              <ChevronDown size={12} className="text-gold/50" />
            </button>

            {sortOpen && (
              <div className="absolute top-full left-0 md:right-0 md:left-auto z-20 mt-1 w-full md:w-48 bg-jet-light border border-gold/20 shadow-xl">
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => { setSortBy(o.id); setSortOpen(false); syncParams(activeCategory, searchQuery, o.id) }}
                    className={`w-full text-left px-4 py-3 font-body text-sm tracking-wide border-b border-gold/10 transition-colors min-h-[44px] ${
                      sortBy === o.id ? 'text-gold bg-gold/5' : 'text-foreground-muted hover:text-gold'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex overflow-x-auto pb-3 gap-2 mb-8 md:flex-wrap">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? ALL_PRODUCTS.length : (categoryCounts[cat.id] || 0)
            if (count === 0) return null
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); syncParams(cat.id, searchQuery, sortBy) }}
                className={`flex-shrink-0 px-4 py-3 text-sm font-body tracking-wide border transition-all duration-300 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  activeCategory === cat.id
                    ? 'border-gold bg-gold text-jet shadow-lg shadow-gold/20'
                    : 'border-gold/20 text-foreground-muted hover:border-gold/50 hover:text-gold bg-jet-light'
                }`}
              >
                {cat.label}
                <span className="text-xs opacity-60 ml-1.5">({count})</span>
              </button>
            )
          })}
        </div>

        {isFiltering && (
          <p className="text-foreground-muted/50 font-body text-xs tracking-widest uppercase mb-6">
            {searchQuery.trim()
              ? `Showing ${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery.trim()}"`
              : `${products.length} result${products.length !== 1 ? 's' : ''} found`}
          </p>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground-muted/40 font-body text-sm tracking-widest uppercase mb-4">No pieces found</p>
            <Link to="/catalog" className="text-gold text-xs tracking-[0.2em] uppercase font-body hover:underline">
              Clear all filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} state={{ from: location.pathname + location.search }} />
              ))}
            </div>
            <p className="text-center mt-10 text-foreground-muted/20 font-body text-xs tracking-[0.3em] uppercase">
              {products.length} of {ALL_PRODUCTS.length} pieces shown
            </p>
          </>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

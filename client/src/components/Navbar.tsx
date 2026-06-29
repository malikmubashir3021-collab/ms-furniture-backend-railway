import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, MapPin, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/store/cart'
import { ALL_PRODUCTS } from '@/lib/products'
import { SOCIAL_LINKS } from '@/lib/social'
import { cn } from '@/lib/utils'

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

function PinterestIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 0-3.16 19.46 9.96 9.96 0 0 1 .15-3.27l1.12-4.76a3.8 3.8 0 0 1-.34-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.54-.25 1.06.53 1.92 1.58 1.92 1.9 0 3.17-2.44 3.17-5.33 0-2.2-1.48-3.84-4.18-3.84a4.7 4.7 0 0 0-4.88 4.74 3.2 3.2 0 0 0 .63 1.97.52.52 0 0 1 .12.5l-.22.88a.37.37 0 0 1-.51.26c-1.42-.58-2.07-2.13-2.07-3.87 0-2.88 2.43-6.33 7.24-6.33 3.86 0 6.4 2.79 6.4 5.79 0 3.96-2.2 6.92-5.45 6.92a2.87 2.87 0 0 1-2.47-1.26l-.7 2.76a10 10 0 1 0 1.65-19.4Z" />
    </svg>
  )
}

const NAV_ITEMS = [
  {
    label: 'Coffee Tables',
    href: '/catalog?category=Coffee+Tables',
    mega: ['The Imperial Arabesque', 'The Noir Riviera', 'The Calligraphy Throne', 'The Emperor Gold', 'The Atrium Extension'],
  },
  {
    label: 'Coffee Sets',
    href: '/catalog?category=Coffee+Sets',
    mega: ['The Versailles Set', 'The Obsidian Bloom', 'The Golden Baroque Trio', 'The Mughal Trio', 'The Grand Vizier'],
  },
  {
    label: 'Sofa Set',
    href: '/catalog?category=Sofa+Set',
    mega: [],
  },
  {
    label: 'Bed Set',
    href: '/catalog?category=Bed+Set',
    mega: [],
  },
  {
    label: 'Collection',
    href: '/catalog',
    mega: [],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMega, setActiveMega] = useState<number | null>(null)
  const location = useLocation()
  const totalItems = useCart((s) => s.totalItems())

  const productNameToId = useMemo(() => {
    const map: Record<string, number> = {}
    ALL_PRODUCTS.forEach(p => { map[p.name.toLowerCase()] = p.id })
    return map
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-jet/95 backdrop-blur-xl border-b border-gold/10">
        <div className="container-main flex items-center justify-between h-16 md:h-[72px]">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gold hover:text-gold-light transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MS Furniture" className="w-9 h-9 rounded-full object-cover" />
            <div className="hidden sm:block">
              <h1 className="font-display text-xl text-gold tracking-wider leading-none">MS Furniture</h1>
              <p className="text-[8px] text-foreground-muted tracking-[0.3em] uppercase leading-none mt-0.5">Royal Luxury</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => setActiveMega(i)}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'px-4 py-6 text-xs tracking-[0.15em] uppercase font-body transition-colors duration-300 flex items-center gap-1',
                    location.pathname === item.href || location.search.includes(item.label)
                      ? 'text-gold'
                      : 'text-foreground/70 hover:text-gold'
                  )}
                >
                  {item.label}
                  {item.mega.length > 0 && <ChevronDown size={10} className="text-gold/50" />}
                </Link>
                {item.mega.length > 0 && activeMega === i && (
                  <div className="absolute top-full left-0 w-64 bg-jet-light border border-gold/10 shadow-2xl py-4 z-50">
                    <div className="px-4 pb-2 mb-2 border-b border-gold/10">
                      <p className="text-xs tracking-[0.2em] uppercase text-gold/60 font-body">Featured</p>
                    </div>
                    {item.mega.map((name) => {
                      const id = productNameToId[name.toLowerCase()]
                      if (!id) return null
                      return (
                        <Link
                          key={name}
                          to={`/product/${id}`}
                          className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-gold hover:bg-jet-lighter transition-colors font-body"
                        >
                          {name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 mr-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors" aria-label="Instagram">
                <InstagramIcon size={14} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors" aria-label="Facebook">
                <FacebookIcon size={14} />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors" aria-label="TikTok">
                <TikTokIcon size={14} />
              </a>
              <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors" aria-label="Pinterest">
                <PinterestIcon size={14} />
              </a>
              <span className="w-px h-4 bg-gold/10 mx-1" />
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
            <Link
              to="/showrooms"
              className="hidden md:flex w-10 h-10 items-center justify-center text-foreground-muted hover:text-gold transition-colors"
              aria-label="Showrooms"
            >
              <MapPin size={17} />
            </Link>
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={17} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-jet text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className={cn(
          'md:hidden border-t border-gold/10 overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[600px]' : 'max-h-0'
        )}>
          <div className="container-main py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-gold transition-colors font-body border-b border-gold/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/showrooms"
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-gold transition-colors font-body"
            >
              Showrooms
            </Link>
          </div>
        </div>
      </header>

      <div className={cn(
        'fixed inset-0 z-[60] bg-jet/95 backdrop-blur-xl flex items-start justify-center pt-24 transition-all duration-300',
        searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="w-full max-w-2xl px-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent border-b-2 border-gold/40 text-foreground text-2xl font-display py-4 pr-12 placeholder:text-foreground-muted/30 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light transition-colors"
            >
              <Search size={22} />
            </button>
          </form>
          <div className="mt-8">
            <p className="text-xs tracking-[0.2em] uppercase text-foreground-muted/50 font-body mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Coffee Tables', 'Coffee Sets', 'Sofa Set', 'Best Sellers', 'New Arrivals'].map((term) => (
                <Link
                  key={term}
                  to={`/catalog?q=${encodeURIComponent(term)}`}
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="text-sm text-foreground-muted hover:text-gold border border-gold/15 px-4 py-2 transition-colors font-body"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-foreground-muted hover:text-gold transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </>
  )
}

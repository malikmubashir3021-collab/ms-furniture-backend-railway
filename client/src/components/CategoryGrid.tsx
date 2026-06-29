import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/SectionHeading'
import { ALL_PRODUCTS } from '@/lib/products'

const CATEGORY_IMAGES: Record<string, string[]> = {}
for (const p of ALL_PRODUCTS) {
  if (p.category === 'Coffee Tables' || p.category === 'Coffee Sets') {
    if (!CATEGORY_IMAGES[p.category]) CATEGORY_IMAGES[p.category] = []
    CATEGORY_IMAGES[p.category].push(p.image)
  }
}

function CyclingImage({ category }: { category: string }) {
  const images = CATEGORY_IMAGES[category] || []
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(id)
  }, [images.length])

  if (!images.length) return null

  return (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={category}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-700 ${
            i === index ? 'opacity-80' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/50 to-jet/20" />
    </>
  )
}

const CATEGORIES = [
  {
    label: 'Coffee Tables',
    href: '/catalog?category=Coffee+Tables',
  },
  {
    label: 'Coffee Sets',
    href: '/catalog?category=Coffee+Sets',
  },
  {
    label: 'Sofa Set',
    href: '/catalog?category=Sofa+Set',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="8" y="30" width="48" height="16" rx="3" />
        <rect x="6" y="24" width="14" height="14" rx="2" />
        <rect x="44" y="24" width="14" height="14" rx="2" />
        <line x1="16" y1="46" x2="16" y2="52" />
        <line x1="48" y1="46" x2="48" y2="52" />
        <line x1="12" y1="52" x2="52" y2="52" />
      </svg>
    ),
  },
  {
    label: 'Bed Set',
    href: '/catalog?category=Bed+Set',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="6" y="24" width="52" height="22" rx="2" />
        <rect x="10" y="28" width="20" height="14" rx="1" />
        <line x1="6" y1="46" x2="6" y2="52" />
        <line x1="58" y1="46" x2="58" y2="52" />
        <line x1="6" y1="52" x2="58" y2="52" />
        <circle cx="44" cy="38" r="4" />
      </svg>
    ),
  },
]

export default function CategoryGrid() {
  return (
    <section className="w-full bg-jet border-t border-gold/5 py-16 md:py-20">
      <div className="container-main">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our curated collections"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="group relative flex flex-col items-center justify-center gap-4 bg-jet-light border border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden"
              style={{ minHeight: '240px' }}
            >
              {('icon' in cat) ? (
                <span className="text-gold/40 group-hover:text-gold transition-colors duration-500 relative z-10">
                  {cat.icon}
                </span>
              ) : (
                <CyclingImage category={cat.label} />
              )}
              <span className="font-display text-xl md:text-2xl text-foreground font-light group-hover:text-gold transition-colors duration-500 relative z-10">
                {cat.label}
              </span>
              <span className="text-foreground-muted text-[10px] tracking-[0.2em] uppercase font-body relative z-10">
                Shop Now
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

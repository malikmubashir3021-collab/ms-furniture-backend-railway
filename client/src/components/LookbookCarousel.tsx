import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getNewArrivals } from '@/lib/products'
import TiltCard from '@/components/TiltCard'

export default function LookbookCarousel() {
  const location = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const products = getNewArrivals(8)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="w-full bg-jet-light border-t border-gold/5 py-16 md:py-20">
      <div className="container-main mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-2">
              Discover Our Collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground font-light">
              New Arrivals
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-6 md:px-8 pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
          >
            <TiltCard maxTilt={4} perspective={1500} scale={1.02}>
            <Link to={`/product/${product.id}`} state={{ from: location.pathname + location.search }} className="block group">
              <div className="bg-jet border border-gold/10 group-hover:border-gold/30 transition-all duration-500 overflow-hidden">
                <div className="aspect-square p-6 flex items-center justify-center bg-jet">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 border-t border-gold/10">
                  <p className="text-gold/50 text-[9px] tracking-[0.2em] uppercase font-body mb-1">{product.category}</p>
                  <h3 className="font-display text-sm text-foreground font-light truncate">{product.name}</h3>
                </div>
              </div>
            </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <div className="container-main mt-8 text-center">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-8 py-4 hover:bg-gold hover:text-jet transition-all duration-300"
        >
          View Full Collection
        </Link>
      </div>
    </section>
  )
}

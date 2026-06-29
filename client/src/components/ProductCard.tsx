import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/products'
import { cn } from '@/lib/utils'
import TiltCard from '@/components/TiltCard'

interface Props {
  product: Product
  index?: number
  state?: Record<string, unknown>
}

export default function ProductCard({ product, index = 0, state }: Props) {
  const addItem = useCart((s) => s.addItem)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <TiltCard maxTilt={6} perspective={1200} scale={1.03}>
      <Link
        to={`/product/${product.id}`}
        state={state}
        className="block group relative bg-jet-light border border-gold/0 hover:border-gold/25 transition-all duration-500"
      >
        <div className="relative w-full aspect-square overflow-hidden bg-jet">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jet/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </div>

        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className={cn(
              'text-[9px] tracking-[0.15em] uppercase font-body font-medium px-2 py-0.5',
              product.badge === 'new' ? 'bg-gold text-jet' : 'bg-jet-lighter text-gold border border-gold/40'
            )}>
              {product.badge === 'new' ? 'New' : 'Best Seller'}
            </span>
          </div>
        )}

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product) }}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-jet/60 backdrop-blur-sm border border-gold/20 hover:bg-gold hover:text-jet hover:border-gold transition-all duration-300"
          aria-label="Add to cart"
        >
          <ShoppingBag size={13} />
        </button>

        <div className="p-3 md:p-4 border-t border-gold/10">
          <p className="text-gold/50 text-[9px] tracking-[0.2em] uppercase font-body mb-1 truncate">
            {product.category}
          </p>
          <h3 className="font-display text-sm md:text-base text-foreground font-light leading-snug mb-2 truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-foreground-muted/60 font-body mb-3 truncate">
            <span>{product.material}</span>
            <span aria-hidden="true">·</span>
            <span>{product.finishing}</span>
          </div>
          <span className="block text-center text-[10px] tracking-[0.2em] uppercase font-body border border-gold/30 text-gold/70 group-hover:bg-gold group-hover:text-jet group-hover:border-gold transition-all duration-300 py-2">
            View Details
          </span>
        </div>
      </Link>
      </TiltCard>
    </motion.div>
  )
}

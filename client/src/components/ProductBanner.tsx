import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/products'
import Parallax3D from '@/components/Parallax3D'
import TiltCard from '@/components/TiltCard'

interface Props {
  product: Product
  index: number
}

export default function ProductBanner({ product, index }: Props) {
  const isReversed = index % 2 !== 0

  return (
    <section className="relative w-full overflow-hidden bg-jet border-t border-gold/5">
      <Parallax3D depth={0.08}>
      <div className="container-main py-16 md:py-24">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${isReversed ? 'direction-md-rtl' : ''}`}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TiltCard maxTilt={4} perspective={1500} scale={1.02}>
            <div className="relative bg-jet-light border border-gold/10 p-8 md:p-12">
              <div className="aspect-square flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain max-w-[400px]"
                />
              </div>
            </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-3">
              {product.category}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground font-light leading-tight mb-4">
              {product.name}
            </h2>
            <div className="w-12 h-px bg-gold/60 mb-4" />
            <p className="text-foreground-muted text-sm font-body leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-xs text-foreground-muted/60 font-body border border-gold/15 px-3 py-1.5">
                {product.material}
              </span>
              <span className="text-xs text-foreground-muted/60 font-body border border-gold/15 px-3 py-1.5">
                {product.finishing}
              </span>
              <span className="text-xs text-foreground-muted/60 font-body border border-gold/15 px-3 py-1.5">
                {product.sizing}
              </span>
            </div>
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
      </Parallax3D>
    </section>
  )
}

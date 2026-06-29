import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-jet">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-20" />
      <div className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-[center_30%] md:bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jet/60 via-jet/30 to-jet/50" />

        <div className="container-main relative z-10 w-full">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gold text-xs tracking-[0.3em] uppercase font-body mb-3"
            >
              Royal Luxury Collection 2026
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              style={{ perspective: 800, transformStyle: 'preserve-3d' }}
              className="w-20 h-0.5 bg-gradient-to-r from-gold/20 via-gold to-gold/20 mb-5 origin-left"
            >
              <motion.div
                animate={{
                  rotateX: [0, 5, 0, -5, 0],
                  rotateY: [0, 3, 0, -3, 0],
                  scaleZ: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ perspective: 800, transformStyle: 'preserve-3d' }}
                className="w-full h-full bg-gradient-to-r from-gold/40 via-gold-light to-gold/40 shadow-lg shadow-gold/20"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground font-light leading-[1.1] mb-4"
            >
              Where Royal Luxury
              <br />
              <span className="text-gold">Takes Its Place</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-foreground-muted text-base md:text-lg font-body leading-relaxed max-w-xl mb-8"
            >
              Handcrafted artisanal furniture in premium finishes — designed for those who demand the extraordinary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300"
              >
                Shop the Collection
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/catalog?sort=bestsellers"
                className="inline-flex items-center border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-8 py-4 hover:bg-gold/10 transition-all duration-300"
              >
                View Best Sellers
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-px h-16 bg-gradient-to-b from-gold/40 to-transparent mx-auto mb-2" />
          <p className="text-[8px] text-foreground-muted/30 tracking-[0.4em] uppercase text-center">Scroll</p>
        </motion.div>
      </div>
    </section>
  )
}

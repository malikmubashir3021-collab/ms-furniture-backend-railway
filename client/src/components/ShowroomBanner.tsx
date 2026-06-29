import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import FloatingOrbs from '@/components/FloatingOrbs'
import Parallax3D from '@/components/Parallax3D'

export default function ShowroomBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-jet border-t border-gold/5">
      <FloatingOrbs />
      <Parallax3D depth={0.05}>
      <div className="container-main py-20 md:py-28 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <MapPin size={32} className="mx-auto text-gold/40 mb-6" />
          <h2 className="font-display text-3xl md:text-5xl text-foreground font-light mb-4">
            Visit Our Showroom
          </h2>
          <p className="text-foreground-muted text-sm md:text-base font-body max-w-lg mx-auto leading-relaxed mb-8">
            Experience the Royal Luxury Collection in person. Visit our Lahore showroom and discover award-winning design and craftsmanship.
          </p>
          <a
            href="https://wa.me/923087678612"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-10 py-4 hover:bg-gold-light transition-all duration-300"
          >
            Contact Us to Book a Visit
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
      </Parallax3D>
    </section>
  )
}

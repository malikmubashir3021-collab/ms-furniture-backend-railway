import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import TiltCard from '@/components/TiltCard'
import FloatingOrbs from '@/components/FloatingOrbs'

interface BlockItem {
  title: string
  subtitle: string
  label: string
  href: string
  bgClass: string
  image?: string
}

interface Props {
  items: [BlockItem, BlockItem]
}

export default function TwoColumnBlock({ items }: Props) {
  return (
    <section className="relative w-full bg-jet border-t border-gold/5 overflow-hidden">
      <FloatingOrbs />
      <div className="container-main py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard maxTilt={5} perspective={1200} scale={1.02}>
              <Link
                to={item.href}
                className={`block relative overflow-hidden group min-h-[300px] md:min-h-[400px] flex items-end ${item.bgClass}`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain p-8 opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-jet/70 via-jet/30 to-transparent" />
                <div className="relative z-10 p-8 md:p-10 w-full">
                  <p className="text-gold/70 text-xs tracking-[0.3em] uppercase font-body mb-2">
                    {item.subtitle}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground font-light mb-4">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-6 py-3 group-hover:bg-gold group-hover:text-jet transition-all duration-300">
                    {item.label}
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

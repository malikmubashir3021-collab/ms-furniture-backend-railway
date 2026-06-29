import SEO from '@/components/SEO'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-jet">
      <SEO title="Page Not Found" canonical="/404" />
      <TopStrip />
      <Navbar />
      <div className="pt-32 pb-20 container-main text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold/40 text-[120px] md:text-[200px] font-display font-light leading-none mb-4">
            404
          </p>
          <h1 className="font-display text-2xl md:text-4xl text-foreground font-light mb-4">
            Page Not Found
          </h1>
          <p className="text-foreground-muted text-sm md:text-base font-body max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let us help you find your way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-8 py-4 hover:bg-gold/10 transition-all duration-300"
            >
              Browse Collection
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

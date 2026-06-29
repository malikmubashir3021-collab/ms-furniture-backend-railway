import SEO from '@/components/SEO'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
import FloatingOrbs from '@/components/FloatingOrbs'
import { useCart } from '@/store/cart'

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div id="main-content" className="min-h-screen bg-jet">
        <SEO title="Your Enquiry" canonical="/cart" />
        <TopStrip />
        <Navbar />
        <div className="pt-32 pb-20 container-main text-center">
          <ShoppingBag size={40} className="mx-auto text-gold/30 mb-6" />
          <h2 className="font-display text-2xl text-foreground mb-3">Your Enquiry List is Empty</h2>
          <p className="text-foreground-muted text-sm font-body mb-8">Browse the collection and add pieces you're interested in.</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300 min-h-[48px]"
          >
            <ArrowLeft size={14} />
            Explore Collection
          </Link>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    )
  }

  const message = items
    .map(item => `${item.product.name} (${item.product.modelNumber || 'N/A'}) × ${item.quantity}`)
    .join('\n')

  return (
    <div id="main-content" className="min-h-screen bg-jet relative overflow-hidden">
      <SEO title="Your Enquiry" canonical="/cart" />
      <TopStrip />
      <Navbar />
      <FloatingOrbs />

      <div className="pt-24 md:pt-32 pb-20 container-main relative z-10">
        <SectionHeading
          title="Your Enquiry"
          subtitle={`${totalItems()} piece${totalItems() !== 1 ? 's' : ''} selected`}
        />

        <div className="max-w-2xl mx-auto">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 p-4 border border-gold/10 mb-3 bg-jet-light"
            >
              <Link to={`/product/${item.product.id}`} className="w-20 h-20 bg-jet flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-display text-sm text-foreground truncate">{item.product.name}</h3>
                </Link>
                <p className="text-[10px] text-gold/50 tracking-[0.15em] uppercase font-body mt-0.5">
                  {item.product.category}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 border border-gold/20 text-foreground-muted hover:text-gold hover:border-gold/50 transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="text-sm text-foreground font-body min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 border border-gold/20 text-foreground-muted hover:text-gold hover:border-gold/50 transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.product.id)}
                className="w-9 h-9 flex items-center justify-center border border-gold/10 text-foreground-muted/50 hover:text-red-400 hover:border-red-400/30 transition-all duration-300 flex-shrink-0"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}

          <div className="mt-10 text-center">
            <a
              href={`https://wa.me/923087678612?text=${encodeURIComponent(`Hello! I'm interested in the following pieces:\n\n${message}\n\nPlease provide pricing and availability.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-10 py-4 hover:bg-gold-light transition-all duration-300 min-h-[48px]"
            >
              <MessageCircle size={16} />
              Send Enquiry via WhatsApp
            </a>
            <p className="text-foreground-muted/40 text-[10px] tracking-wider font-body mt-3">
              We'll respond with pricing and availability
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

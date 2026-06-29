import { useState, useCallback, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '@/components/SEO'
import JsonLd from '@/components/JsonLd'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import TiltCard from '@/components/TiltCard'
import Parallax3D from '@/components/Parallax3D'
import { ALL_PRODUCTS, type Product } from '@/lib/products'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'
import { api, apiUrl } from '@/lib/api'

export default function ProductDetail() {
  const { id } = useParams()
  const location = useLocation()
  const addItem = useCart((s) => s.addItem)
  const [product, setProduct] = useState<Product | undefined>(() =>
    ALL_PRODUCTS.find(p => p.id === Number(id))
  )
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const pid = Number(id)
    const fallback = ALL_PRODUCTS.find(p => p.id === pid)
    setProduct(fallback)
    if (!pid) return
    api<Product>(`/api/products/${pid}`).then(data => {
      if (data) setProduct(data)
    })
  }, [id])

  const allImages = product ? [product.image, ...(product.images || [])] : []

  const prev = useCallback(() => {
    setActiveImage(i => (i === 0 ? allImages.length - 1 : i - 1))
  }, [allImages.length])

  const next = useCallback(() => {
    setActiveImage(i => (i === allImages.length - 1 ? 0 : i + 1))
  }, [allImages.length])

  if (!product) {
    return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title="Piece Not Found" />
        <TopStrip />
        <Navbar />
        <div className="pt-32 pb-20 container-main text-center">
          <h1 className="font-display text-3xl text-gold mb-4">Piece Not Found</h1>
          <Link to={(location.state as { from?: string })?.from || '/catalog'} className="text-sm text-foreground-muted hover:text-gold transition-colors">
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const specs = [
    { label: 'Model', value: product.modelNumber },
    { label: 'Material', value: product.material },
    { label: 'Dimensions', value: product.sizing },
    { label: 'Colour Scheme', value: product.colorScheme },
    { label: 'Top Type', value: product.topType },
    { label: 'Finishing', value: product.finishing },
  ]

  return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title={product.name} description={product.description} canonical={`/product/${product.id}`} />
      <JsonLd product={product} />
      <TopStrip />
      <Navbar />

      <div className="pt-8 pb-20 container-main">
        <Link
          to={(location.state as { from?: string })?.from || '/catalog'}
          className="inline-flex items-center gap-2 text-foreground-muted/60 hover:text-gold text-xs tracking-[0.2em] uppercase font-body transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TiltCard maxTilt={5} perspective={1200} scale={1.02}>
            <div className="relative bg-jet-light border border-gold/10 overflow-hidden group">
              <div className="h-64 md:aspect-square md:h-auto flex items-center justify-center p-4 md:p-12">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={apiUrl(allImages[activeImage])}
                    alt={product.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className={cn(
                    'text-[10px] tracking-[0.15em] uppercase font-body font-medium px-3 py-1',
                    product.badge === 'new' ? 'bg-gold text-jet' : 'bg-jet-lighter text-gold border border-gold/40'
                  )}>
                    {product.badge === 'new' ? 'New Arrival' : 'Best Seller'}
                  </span>
                </div>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeImage ? 'bg-gold w-5' : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            </TiltCard>
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                      i === activeImage ? 'border-gold opacity-100' : 'border-gold/20 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img src={apiUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          ><Parallax3D depth={0.04}>
            <p className="text-gold/60 text-xs tracking-[0.2em] uppercase font-body mb-2">
              {product.category}
            </p>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground font-light leading-tight mb-4">
              {product.name}
            </h1>

            <div className="w-12 h-px bg-gold/60 mb-6" />

            <p className="text-foreground-muted text-sm font-body leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => addItem(product)}
                className="flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300"
              >
                <ShoppingBag size={14} />
                Add to Enquiry
              </button>
              <a
                href={`https://wa.me/923087678612?text=${encodeURIComponent(`I'm interested in: ${product.name} (Model: ${product.modelNumber})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-8 py-4 hover:bg-gold/10 transition-all duration-300"
              >
                <MessageCircle size={14} />
                Inquire on WhatsApp
              </a>
            </div>

            <div className="border-t border-gold/10 pt-8">
              <h3 className="font-display text-lg text-gold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 gap-1">
                {specs.filter(s => s.value && s.value !== 'N/A').map((spec) => (
                  <div key={spec.label} className="flex items-start gap-4 py-3 border-b border-gold/5">
                    <span className="text-xs tracking-[0.15em] uppercase text-foreground-muted/50 font-body min-w-[120px]">
                      {spec.label}
                    </span>
                    <span className="text-sm text-foreground/80 font-body">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Parallax3D></motion.div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

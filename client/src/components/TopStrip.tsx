import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, X } from 'lucide-react'

interface Slide {
  id: number
  text: string
}

const slides: Slide[] = [
  { id: 1, text: 'Royal Luxury Collection 2026 — Explore Handcrafted Excellence' },
  { id: 2, text: 'Free Delivery Across Pakistan — On Orders Above PKR 50,000' },
  { id: 3, text: 'Visit Our Lahore Showroom — Experience Luxury In Person' },
  { id: 4, text: 'Bespoke Customization Available — Design Your Dream Piece' },
]

export default function TopStrip() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartY = useRef(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showArrows, setShowArrows] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const total = slides.length

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (!isPaused) {
      const id = setInterval(goNext, 4000)
      intervalRef.current = id
      return () => clearInterval(id)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, goNext])

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) goNext()
    else goPrev()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 30) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); goNext() }
    if (e.key === 'ArrowUp') { e.preventDefault(); goPrev() }
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={dismissed ? { height: 0, opacity: 0, marginTop: 0 } : { height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`relative overflow-hidden bg-gradient-to-r from-gold-dark via-gold to-gold-dark select-none ${dismissed ? 'pointer-events-none' : ''}`}
          onMouseEnter={() => { setIsPaused(true); setShowArrows(true) }}
          onMouseLeave={() => { setIsPaused(false); setShowArrows(false) }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Announcements"
          aria-roledescription="carousel"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          />

          <div className="relative z-10 flex items-center justify-center py-2.5 px-12">
            <AnimatePresence>
              {showArrows && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-4 text-jet/50 hover:text-jet transition-colors"
                  aria-label="Previous announcement"
                >
                  <ChevronUp size={14} />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="overflow-hidden h-5 flex items-center">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.span
                  key={current}
                  custom={direction}
                  initial={{ y: direction > 0 ? 24 : -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction > 0 ? -24 : 24, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="text-jet text-xs font-body font-medium uppercase tracking-[0.15em] whitespace-nowrap"
                >
                  {slides[current].text}
                </motion.span>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showArrows && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-10 text-jet/50 hover:text-jet transition-colors"
                  aria-label="Next announcement"
                >
                  <ChevronDown size={14} />
                </motion.button>
              )}
            </AnimatePresence>

            <button
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-1.5 text-jet/60 hover:text-jet transition-colors z-20"
              aria-label="Close announcements"
            >
              <X size={14} />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-1 pb-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className={`rounded-full transition-all ${
                  i === current ? 'bg-jet w-3 h-1.5' : 'bg-jet/30 w-1.5 h-1.5'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
    </motion.div>
  )
}

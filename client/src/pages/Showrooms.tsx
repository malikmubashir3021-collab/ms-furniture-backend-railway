import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
import SEO from '@/components/SEO'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import TiltCard from '@/components/TiltCard'
import Parallax3D from '@/components/Parallax3D'

const SHOWROOMS = [
  {
    city: 'Lahore',
    address: '23-A Main Boulevard, Gulberg III, Lahore 54000',
    phone: '+92 308 7678612',
    hours: 'Mon–Sat: 10:00 AM – 8:00 PM\nSunday: Closed',
    image: '/images/hero-bg.jpg',
  },
]

export default function Showrooms() {
  return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title="Showrooms" description="Visit our showroom in Lahore to experience our luxury furniture collections in person." canonical="/showrooms" />
      <TopStrip />
      <Navbar />

      <div className="pt-24 md:pt-32 pb-20">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-3">
              Visit Us
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground font-light mb-4">
              Our <span className="text-gold">Showrooms</span>
            </h1>
            <p className="text-foreground-muted text-sm md:text-base font-body max-w-xl mx-auto">
              Experience our collections in person. Visit a showroom to see, touch, and feel the craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 max-w-lg mx-auto gap-8">
            {SHOWROOMS.map((showroom, i) => (
              <motion.div
                key={showroom.city}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <TiltCard maxTilt={3} perspective={1200} scale={1.01}>
                  <Parallax3D depth={0.05}>
                    <div className="bg-jet-light border border-gold/10 overflow-hidden group">
                      <div className="h-56 md:h-64 overflow-hidden">
                        <img
                          src={showroom.image}
                          alt={`${showroom.city} Showroom`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8">
                        <h3 className="font-display text-2xl text-gold mb-4">{showroom.city}</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin size={15} className="text-gold/60 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground-muted text-sm font-body">{showroom.address}</span>
                          </div>
                          <a href={`tel:${showroom.phone}`} className="flex items-start gap-3 hover:text-gold transition-colors">
                            <Phone size={15} className="text-gold/60 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground-muted text-sm font-body">{showroom.phone}</span>
                          </a>
                          <div className="flex items-start gap-3">
                            <Clock size={15} className="text-gold/60 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground-muted text-sm font-body whitespace-pre-line">{showroom.hours}</span>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/923087678612?text=${encodeURIComponent(`Hello! I'd like to visit the ${showroom.city} showroom.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-6 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-6 py-3 hover:bg-gold hover:text-jet transition-all duration-300"
                        >
                          Book Appointment
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    </div>
                  </Parallax3D>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Shield, Leaf, Gem } from 'lucide-react'
import SEO from '@/components/SEO'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Parallax3D from '@/components/Parallax3D'
import FloatingOrbs from '@/components/FloatingOrbs'

const SECTIONS = [
  {
    icon: <Gem size={20} />,
    title: 'Our Story',
    content: 'Founded in Lahore, MS Furniture was born from a passion for preserving the rich heritage of South Asian craftsmanship while embracing contemporary design. For over a decade, we have partnered with master artisans who have honed their skills over generations — woodcarvers, metalworkers, and upholsterers who transform raw materials into heirloom pieces.',
  },
  {
    icon: <Award size={20} />,
    title: 'Craftsmanship',
    content: 'Every piece in our collection is handcrafted using time-honoured techniques passed down through generations. From hand-carved mango wood to precision-forged brass inlays, our artisans bring centuries of tradition to each creation. We source the finest materials — solid hardwoods, Italian marble, premium upholstery fabrics — ensuring every detail meets our exacting standards.',
  },
  {
    icon: <Leaf size={20} />,
    title: 'Sustainability',
    content: 'We are committed to responsible craftsmanship. Our wood is sourced from sustainably managed forests, our artisans work in fair-trade conditions, and we minimise waste through thoughtful design and production. Each piece is built to last a lifetime — the most sustainable choice of all.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Trade & Commercial',
    content: 'MS Furniture partners with interior designers, architects, hotels, and restaurants worldwide. Our trade program offers exclusive pricing, custom finishes, and priority production. Contact our trade team to discuss your project requirements.',
  },
]

export default function About() {
  return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title="About" description="Discover the story behind MS Furniture — handcrafted luxury since 2014." canonical="/about" />
      <TopStrip />
      <Navbar />

      <div className="pt-24 md:pt-32 pb-20 relative overflow-hidden">
        <FloatingOrbs />
        <div className="container-main relative z-10">
          <div className="text-center mb-16">
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-3">
              About MS Furniture
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground font-light mb-4">
              Crafting <span className="text-gold">Royalty</span> Since 2014
            </h1>
            <p className="text-foreground-muted text-sm md:text-base font-body max-w-2xl mx-auto">
              Where traditional artistry meets modern luxury — every piece tells a story of meticulous craftsmanship and timeless elegance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {SECTIONS.map((section, i) => (
              <Parallax3D key={section.title} depth={0.04}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-jet-light border border-gold/10 p-8 md:p-10"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 flex items-center justify-center border border-gold/20 text-gold flex-shrink-0">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-xl md:text-2xl text-gold mb-3">{section.title}</h2>
                      <p className="text-foreground-muted text-sm font-body leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              </Parallax3D>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-foreground-muted/60 text-sm font-body mb-6">
              Ready to experience our collection in person?
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/showrooms"
                className="inline-flex items-center gap-2 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-8 py-4 hover:bg-gold-light transition-all duration-300"
              >
                Visit a Showroom
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase font-body px-8 py-4 hover:bg-gold/10 transition-all duration-300"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

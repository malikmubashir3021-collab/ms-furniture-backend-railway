import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/social'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

function PinterestIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 0-3.16 19.46 9.96 9.96 0 0 1 .15-3.27l1.12-4.76a3.8 3.8 0 0 1-.34-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.54-.25 1.06.53 1.92 1.58 1.92 1.9 0 3.17-2.44 3.17-5.33 0-2.2-1.48-3.84-4.18-3.84a4.7 4.7 0 0 0-4.88 4.74 3.2 3.2 0 0 0 .63 1.97.52.52 0 0 1 .12.5l-.22.88a.37.37 0 0 1-.51.26c-1.42-.58-2.07-2.13-2.07-3.87 0-2.88 2.43-6.33 7.24-6.33 3.86 0 6.4 2.79 6.4 5.79 0 3.96-2.2 6.92-5.45 6.92a2.87 2.87 0 0 1-2.47-1.26l-.7 2.76a10 10 0 1 0 1.65-19.4Z" />
    </svg>
  )
}

const FOOTER_LINKS = {
  'The Collection': {
    href: '/catalog',
    children: [
      { label: 'Coffee Tables', href: '/catalog?category=Coffee+Tables' },
      { label: 'Coffee Sets', href: '/catalog?category=Coffee+Sets' },
      { label: 'Sofa Set', href: '/catalog?category=Sofa+Set' },
      { label: 'Bed Set', href: '/catalog?category=Bed+Set' },
      { label: 'New Arrivals', href: '/catalog?sort=newest' },
      { label: 'Best Sellers', href: '/catalog?sort=bestsellers' },
    ],
  },
  'Customer Service': {
    href: '#',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Find a Showroom', href: '/showrooms' },
      { label: 'Shipping & Delivery', href: '/contact' },
      { label: 'Product Care', href: '/about' },
    ],
  },
  'About': {
    href: '#',
    children: [
      { label: 'Our Story', href: '/about' },
      { label: 'Craftsmanship', href: '/about' },
      { label: 'Sustainability', href: '/about' },
      { label: 'Trade & Commercial', href: '/about' },
    ],
  },
  'Support': {
    href: '#',
    children: [
      { label: 'FAQ', href: '/contact' },
      { label: 'Warranty', href: '/contact' },
      { label: 'Privacy Policy', href: '/contact' },
      { label: 'Terms & Conditions', href: '/contact' },
    ],
  },
}

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')
    setSubscribed(true)
  }

  return (
    <footer className="bg-jet-light border-t border-gold/10">
      <div className="container-main">
        <div className="py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12 pb-12 border-b border-gold/10">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="MS Furniture" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-display text-xl text-gold tracking-wider">MS Furniture</h3>
                  <p className="text-[9px] text-foreground-muted tracking-[0.3em] uppercase">Royal Luxury</p>
                </div>
              </div>
              <p className="text-foreground-muted text-sm font-body leading-relaxed">
                Established with a passion for handcrafted excellence, MS Furniture brings you the finest in royal luxury furniture — where every piece tells a story of unparalleled craftsmanship and timeless design.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <p className="text-xs tracking-[0.2em] uppercase text-gold font-body mb-3">Join Us</p>
              <p className="text-foreground-muted text-sm font-body mb-4">Sign up to hear about new collections, offers and inspiration.</p>
              {subscribed ? (
                <p className="text-gold/80 text-sm font-body">Thank you! You're now subscribed.</p>
              ) : (
              <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                    placeholder="Your email address"
                    className="flex-1 bg-jet border border-gold/15 text-foreground/80 text-sm font-body px-4 py-3 placeholder:text-foreground-muted/30 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-6 py-3 hover:bg-gold-light transition-colors flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                {emailError && (
                  <p className="flex items-center gap-1 text-red-400/80 text-[10px] font-body">
                    <AlertCircle size={10} />
                    {emailError}
                  </p>
                )}
              </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {Object.entries(FOOTER_LINKS).map(([title, section]) => (
              <FooterColumn key={title} title={title} links={section.children} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gold/10">
            <div className="flex items-center gap-4">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground-muted hover:text-gold transition-colors" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-foreground-muted hover:text-gold transition-colors" aria-label="Facebook">
                <FacebookIcon size={18} />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="text-foreground-muted hover:text-gold transition-colors" aria-label="TikTok">
                <TikTokIcon size={18} />
              </a>
              <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" className="text-foreground-muted hover:text-gold transition-colors" aria-label="Pinterest">
                <PinterestIcon size={18} />
              </a>
              <span className="w-px h-4 bg-gold/20" />
              <a href="https://wa.me/923087678612" target="_blank" rel="noopener noreferrer" className="text-foreground-muted hover:text-gold transition-colors" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-foreground-muted/50 font-body text-center">
              &copy; {new Date().getFullYear()} MS Furniture. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:block">
      <button
        onClick={() => setOpen(!open)}
        className="md:cursor-default flex items-center justify-between w-full text-xs tracking-[0.2em] uppercase text-gold font-body mb-4 md:mb-4 py-2 md:py-0"
      >
        {title}
        <ChevronDown size={12} className={`md:hidden transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`flex flex-col gap-2.5 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-3' : 'max-h-0 md:max-h-96 md:pb-0'}`}>
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="text-sm text-foreground-muted hover:text-gold transition-colors font-body"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

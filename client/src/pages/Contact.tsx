import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin, AlertCircle } from 'lucide-react'
import SEO from '@/components/SEO'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import TiltCard from '@/components/TiltCard'
import Parallax3D from '@/components/Parallax3D'
import { cn } from '@/lib/utils'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim() || name.trim().length < 2) errors.name = 'Please enter your full name (at least 2 characters)'
  if (!email.trim()) errors.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Please enter a valid email address'
  if (!message.trim() || message.trim().length < 10) errors.message = 'Please enter at least 10 characters for your message'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form.name, form.email, form.message)
  const hasErrors = Object.keys(errors).length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (hasErrors) return
    setSubmitted(true)
    const text = `New Inquiry from MS Furniture Website:%0A%0A
Name: ${form.name}%0A
Email: ${form.email}%0A
Phone: ${form.phone}%0A
Message: ${form.message}`
    window.open(`https://wa.me/923087678612?text=${text}`, '_blank')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
  }, [])

  return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title="Contact Us" description="Get in touch with MS Furniture. Visit our showroom or send us a message." canonical="/contact" />
      <TopStrip />
      <Navbar />

      <div className="pt-24 md:pt-32 pb-20">
        <div className="container-main">
          <div className="text-center mb-16">
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-body mb-3">
              Get in Touch
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground font-light mb-4">
              We'd Love to <span className="text-gold">Hear From You</span>
            </h1>
            <p className="text-foreground-muted text-sm md:text-base font-body max-w-xl mx-auto">
              Whether you have a question about our pieces, need design advice, or want to schedule a showroom visit — our team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <TiltCard maxTilt={3} perspective={1500} scale={1.01}>
                <form
                  onSubmit={handleSubmit}
                  className="bg-jet-light border border-gold/10 p-8 md:p-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-gold/60 font-body mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="John Doe"
                        className={cn(
                          'w-full bg-jet border text-foreground/80 font-body text-sm px-4 py-3.5 placeholder:text-foreground-muted/25 focus:outline-none transition-colors',
                          touched.name && errors.name
                            ? 'border-red-400/60 focus:border-red-400'
                            : 'border-gold/15 focus:border-gold/50'
                        )}
                      />
                      {touched.name && errors.name && (
                        <p className="flex items-center gap-1 text-red-400/80 text-[10px] mt-1.5 font-body">
                          <AlertCircle size={10} />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-gold/60 font-body mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="john@example.com"
                        className={cn(
                          'w-full bg-jet border text-foreground/80 font-body text-sm px-4 py-3.5 placeholder:text-foreground-muted/25 focus:outline-none transition-colors',
                          touched.email && errors.email
                            ? 'border-red-400/60 focus:border-red-400'
                            : 'border-gold/15 focus:border-gold/50'
                        )}
                      />
                      {touched.email && errors.email && (
                        <p className="flex items-center gap-1 text-red-400/80 text-[10px] mt-1.5 font-body">
                          <AlertCircle size={10} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-gold/60 font-body mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full bg-jet border border-gold/15 text-foreground/80 font-body text-sm px-4 py-3.5 placeholder:text-foreground-muted/25 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-gold/60 font-body mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      placeholder="Tell us about your requirements, preferred pieces, or any questions..."
                      className={cn(
                        'w-full bg-jet border text-foreground/80 font-body text-sm px-4 py-3.5 placeholder:text-foreground-muted/25 focus:outline-none transition-colors resize-none',
                        touched.message && errors.message
                          ? 'border-red-400/60 focus:border-red-400'
                          : 'border-gold/15 focus:border-gold/50'
                      )}
                    />
                    {touched.message && errors.message && (
                      <p className="flex items-center gap-1 text-red-400/80 text-[10px] mt-1.5 font-body">
                        <AlertCircle size={10} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitted}
                    className="w-full flex items-center justify-center gap-3 bg-gold text-jet text-xs tracking-[0.2em] uppercase font-body font-medium px-10 py-4 hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    {submitted ? 'Opening WhatsApp...' : 'Send Inquiry via WhatsApp'}
                  </button>

                  <p className="text-center text-foreground-muted/40 text-[10px] tracking-wider font-body mt-4">
                    We typically respond within 2–4 hours during business hours
                  </p>
                </form>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <Parallax3D depth={0.06}>
                <div className="space-y-6">
                  {[
                    {
                      icon: <Phone size={18} />,
                      title: 'Phone',
                      content: '+92 308 7678612',
                      href: 'tel:+923087678612',
                    },
                    {
                      icon: <Mail size={18} />,
                      title: 'Email',
                      content: 'info@msfurniturelahore.com',
                      href: 'mailto:info@msfurniturelahore.com',
                    },
                    {
                      icon: <MapPin size={18} />,
                      title: 'Showroom',
                      content: 'Lahore, Pakistan\nVisit by appointment',
                      href: '/showrooms',
                    },
                  ].map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="block bg-jet-light border border-gold/10 p-6 hover:border-gold/25 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex items-center justify-center border border-gold/20 text-gold/70 group-hover:bg-gold group-hover:text-jet transition-all duration-300 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-gold/50 font-body mb-1">
                            {item.title}
                          </p>
                          <p className="text-sm text-foreground/80 font-body whitespace-pre-line">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}

                  <div className="bg-jet-light border border-gold/10 p-6 mt-6">
                    <p className="text-xs tracking-[0.2em] uppercase text-gold font-body mb-3">
                      Business Hours
                    </p>
                    <div className="space-y-2">
                      {[
                        { day: 'Monday – Friday', hours: '10:00 AM – 8:00 PM' },
                        { day: 'Saturday', hours: '11:00 AM – 6:00 PM' },
                        { day: 'Sunday', hours: 'Closed' },
                      ].map(({ day, hours }) => (
                        <div key={day} className="flex items-center justify-between text-sm font-body">
                          <span className="text-foreground-muted">{day}</span>
                          <span className="text-foreground/70">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Parallax3D>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

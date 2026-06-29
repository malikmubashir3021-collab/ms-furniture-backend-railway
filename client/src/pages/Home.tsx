import SEO from '@/components/SEO'
import JsonLd from '@/components/JsonLd'
import CategoryGrid from '@/components/CategoryGrid'
import TopStrip from '@/components/TopStrip'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ProductBanner from '@/components/ProductBanner'
import TwoColumnBlock from '@/components/TwoColumnBlock'
import LookbookCarousel from '@/components/LookbookCarousel'
import ShowroomBanner from '@/components/ShowroomBanner'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { ALL_PRODUCTS, getBestSellers } from '@/lib/products'

const FEATURED_PRODUCTS = getBestSellers(5)

function productImage(id: number): string {
  const p = ALL_PRODUCTS.find(x => x.id === id)
  return p?.image || ''
}

export default function Home() {
  return (
    <div id="main-content" className="min-h-screen bg-jet">
      <SEO title="Home" description="Handcrafted luxury furniture in premium finishes — Royal Luxury Collection 2026." canonical="/" />
      <JsonLd />
      <TopStrip />
      <Navbar />
      <HeroSection />

      <CategoryGrid />

      {FEATURED_PRODUCTS.slice(0, 5).map((product, i) => (
        <ProductBanner key={product.id} product={product} index={i} />
      ))}

      <TwoColumnBlock
        items={[
          {
            title: 'Coffee Sets',
            subtitle: 'Curated Ensembles',
            label: 'Discover Sets',
            href: '/catalog?category=Coffee+Sets',
            bgClass: 'bg-[linear-gradient(135deg,#1A1A1A,#0A0A0A)]',
            image: productImage(49),
          },
          {
            title: 'Sofa Set',
            subtitle: 'Coming Soon',
            label: 'Explore Living',
            href: '/catalog?category=Sofa+Set',
            bgClass: 'bg-[linear-gradient(135deg,#2A2A2A,#1A1A1A)]',
            image: productImage(1),
          },
        ]}
      />

      <TwoColumnBlock
        items={[
          {
            title: 'Custom Craftsmanship',
            subtitle: 'Bespoke Furniture',
            label: 'Learn More',
            href: '#',
            bgClass: 'bg-[linear-gradient(135deg,#0A0A0A,#1A1A1A)]',
            image: productImage(10),
          },
          {
            title: 'Bed Set',
            subtitle: 'Coming Soon',
            label: 'View Beds',
            href: '/catalog?category=Bed+Set',
            bgClass: 'bg-[linear-gradient(135deg,#1A1A1A,#2A2A2A)]',
            image: productImage(3),
          },
        ]}
      />

      <LookbookCarousel />
      <ShowroomBanner />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

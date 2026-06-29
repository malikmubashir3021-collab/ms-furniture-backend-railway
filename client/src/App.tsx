import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from '@/components/ErrorBoundary'
import ScrollToTop from '@/components/ScrollToTop'

const Home = lazy(() => import('@/pages/Home'))
const Catalog = lazy(() => import('@/pages/Catalog'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Cart = lazy(() => import('@/pages/Cart'))
const Contact = lazy(() => import('@/pages/Contact'))
const Showrooms = lazy(() => import('@/pages/Showrooms'))
const About = lazy(() => import('@/pages/About'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const queryClient = new QueryClient()

function App() {
  return (
    <HelmetProvider>
    <ErrorBoundary>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-3 focus:bg-gold focus:text-jet focus:text-xs focus:tracking-[0.2em] focus:uppercase focus:font-body">
      Skip to main content
    </a>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-jet flex items-center justify-center"><div className="w-6 h-6 border border-gold/30 border-t-gold rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/showrooms" element={<Showrooms />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
    </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App

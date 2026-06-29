import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://msfurniturelahore.com'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MS Furniture',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'Handcrafted luxury furniture in premium finishes — Royal Luxury Collection.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-308-7678612',
    contactType: 'customer service',
    availableLanguage: ['English', 'Urdu'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lahore',
    addressCountry: 'PK',
  },
}

interface Props {
  product?: {
    name: string
    description: string
    image: string
    modelNumber?: string
    material?: string
    category?: string
  }
}

export default function JsonLd({ product }: Props) {
  const schemas: Record<string, unknown>[] = [organization]

  if (product) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: `${SITE_URL}${product.image}`,
      ...(product.modelNumber && { sku: product.modelNumber, mpn: product.modelNumber }),
      ...(product.material && { material: product.material }),
      ...(product.category && { category: product.category }),
      brand: { '@type': 'Brand', name: 'MS Furniture' },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'PKR',
      },
    })
  }

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

import { Helmet } from 'react-helmet-async'

interface Props {
  title: string
  description?: string
  image?: string
  canonical?: string
}

const SITE_NAME = 'MS Furniture — Royal Luxury'
const SITE_URL = 'https://msfurniturelahore.com'

export default function SEO({ title, description = 'Handcrafted artisanal furniture in premium finishes — designed for those who demand the extraordinary.', image, canonical }: Props) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const ogImage = image || '/images/hero-bg.jpg'
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Helmet>
  )
}

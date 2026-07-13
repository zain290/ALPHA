import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: string;
  imageUrl?: string;
  schemaMarkup?: string;
  noindex?: boolean;
  locale?: string;
}

export default function SEO({ title, description, canonicalUrl, type = 'website', imageUrl, schemaMarkup, noindex = false, locale = 'en' }: SEOProps) {
  const siteName = 'ALPHA';
  const defaultImage = imageUrl || '/assets/hero.png';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <html lang={locale} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:site" content="@alpha" />

      {/* Schema */}
      {schemaMarkup && (
        <script type="application/ld+json">{schemaMarkup}</script>
      )}
    </Helmet>
  );
}
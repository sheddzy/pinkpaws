import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteUrl } from '@/lib/content';

export default function SiteLayout({ children }) {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const ld = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Pink Paws Groomers',
    description: 'Business consulting firm covering customer service, attitude development, business and NGO start-up, strategy and sustainability.',
    url: siteUrl(), logo: `${siteUrl()}/logo.png`, foundingDate: '2014',
    address: { '@type': 'PostalAddress', addressLocality: 'Lekki', addressRegion: 'Lagos', addressCountry: 'NG' },
    sameAs: [process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/pink-paws/'],
  };
  return (
    <>
      <a href="#main" className="hp" style={{ position: 'absolute' }}>Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {ga && (<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`}</Script></>)}
    </>
  );
}

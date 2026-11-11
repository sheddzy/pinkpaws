import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';

const head = Playfair_Display({ subsets: ['latin'], variable: '--font-head', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Pink Paws Groomers | Business Consulting in Lagos', template: '%s | Pink Paws Groomers' },
  description: 'Pink Paws Groomers is a Lagos business consulting firm covering customer service, attitude development, business and NGO start-up, strategy and sustainability.',
  openGraph: { siteName: 'Pink Paws Groomers', type: 'website', locale: 'en_NG', images: ['/logo.png'] },
  icons: { icon: '/logo.png' },
};

export default function Root({ children }) {
  return (
    <html lang="en-NG" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

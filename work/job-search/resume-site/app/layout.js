import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Ben Price — Product Marketing Manager',
  description:
    'Product marketer, growth strategist, and mission-driven operator. Building positioning and messaging that moves sales and adoption.',
  openGraph: {
    title: 'Ben Price — Product Marketing Manager',
    description: 'Building positioning and messaging that moves sales and adoption.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

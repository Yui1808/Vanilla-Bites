import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CartConflictModal from '@/components/cart/CartConflictModal';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'VANILLA BITES — Haute Multi-Restaurant Food Ordering Marketplace',
  description:
    'Experience curated fine dining, artisan desserts, and gourmet culinary craft delivered directly by restaurant-managed fleets.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getSessionUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-vanilla-cream text-vanilla-espresso antialiased min-h-screen flex flex-col selection:bg-vanilla-caramel/20 selection:text-vanilla-espresso font-sans">
        <AuthProvider initialUser={initialUser}>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <CartDrawer />
            <CartConflictModal />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

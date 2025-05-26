'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ApolloWrapper } from "./components/AppoloWrapper";
import { usePathname } from 'next/navigation';
import LoadingOverlay from './components/LoadingOverlay';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

// Composant client pour gérer la logique conditionnelle
function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout;
    setLoading(true);
    timeout = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Pages où on ne veut pas afficher navbar et footer
  const othersPages = ['/auth/login', '/auth/register', '/dashboard/messages'];
  const isOthersPage = othersPages.includes(pathname);

  if (isOthersPage) {
    return (
      <main className="min-h-screen" key="others-page">
        {loading && <LoadingOverlay />}
        <div key={`content-${pathname}`}>{children}</div>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" key="main-layout">
      {loading && <LoadingOverlay />}
      <Navbar />
      <main className="flex-grow pt-16">
        <div key={`content-${pathname}`}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ApolloWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ApolloWrapper>
      </body>
    </html>
  );
}


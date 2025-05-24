'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ApolloWrapper } from "./components/AppoloWrapper";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

// Composant client pour gérer la logique conditionnelle
function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Pages où on ne veut pas afficher navbar et footer
  const authPages = ['/auth/login', '/auth/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
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

